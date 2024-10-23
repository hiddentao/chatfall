import fs from "fs"
import path from "path"
import { transform } from "@svgr/core"
import Bun, { type BunPlugin } from "bun"
import { execa } from "execa"

// clean old files
const distBinDir = path.resolve(__dirname, "../dist-bin")
fs.readdirSync(distBinDir).forEach((file) => {
  fs.unlinkSync(path.join(distBinDir, file))
})

const svg: BunPlugin = {
  name: "SVG React Loader",
  setup(build) {
    build.onResolve({ filter: /\.svg\?react$/ }, (args) => ({
      path: path.resolve(
        path.join(__dirname, "../../client/src/components/"),
        args.path.replace(/\?react$/, ""),
      ),
      namespace: "svg-react",
    }))

    build.onLoad({ filter: /\.svg$/, namespace: "svg-react" }, async (args) => {
      const svgFile = await Bun.file(args.path).text()
      const jsCode = await transform(
        svgFile,
        {
          plugins: ["@svgr/plugin-jsx"],
          typescript: true,
        },
        { componentName: "SvgComponent" },
      )
      return { loader: "tsx", contents: jsCode }
    })
  },
}

const result = await Bun.build({
  entrypoints: [path.resolve(__dirname, "../src/index.ts")],
  outdir: path.resolve(__dirname, "../dist"),
  target: "bun",
  sourcemap: "inline",
  minify: true,
  plugins: [svg],
})

if (!result.success) {
  console.error("Build failed")
  for (const message of result.logs) {
    console.error(message)
  }
  process.exit(1)
}

const platforms = [
  { name: "linux-x64", target: "bun-linux-x64" },
  { name: "linux-arm64", target: "bun-linux-arm64" },
  { name: "macos-x64", target: "bun-darwin-x64" },
  { name: "macos-arm64", target: "bun-darwin-arm64" },
  { name: "windows-x64", target: "bun-win32-x64" },
]

for (const platform of platforms) {
  try {
    await execa("bun", [
      "build",
      path.resolve(__dirname, "../dist/index.js"),
      "--compile",
      "--outfile",
      path.resolve(__dirname, `../dist-bin/chatfall-${platform.name}`),
      "--target",
      platform.target,
    ])
    console.log(`Built executable for ${platform.name}`)
  } catch (error) {
    console.error(`Failed to build for ${platform.name}:`, error)
  }
}

console.log("All done ✅")
