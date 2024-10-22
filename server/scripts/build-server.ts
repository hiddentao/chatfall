import path from "path"
import { transform } from "@svgr/core"
import Bun, { type BunPlugin } from "bun"

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
  plugins: [svg],
})

if (!result.success) {
  console.error("Build failed")
  for (const message of result.logs) {
    // Bun will pretty print the message object
    console.error(message)
  }
}
