import fs from "fs"
import path from "path"
import autoprefixer from "autoprefixer"
import esbuild from "esbuild"
import svgr from "esbuild-plugin-svgr"
import tailwind from "esbuild-plugin-tailwind"
import postcssImport from "postcss-import"
import tailwindcss from "tailwindcss"
import tailwindNesting from "tailwindcss/nesting/index.js"
import yargs from "yargs"

const isDev = process.env.NODE_ENV === "development"

const args = yargs(process.argv.slice(2)).options({
  watch: { type: "boolean", default: false },
}).argv

const FRONTEND_NAME = "frontend"

// clean old files
const publicDir = path.resolve(__dirname, "../public")
fs.readdirSync(publicDir).forEach((file) => {
  if (file.startsWith(FRONTEND_NAME)) {
    fs.unlinkSync(path.join(publicDir, file))
  }
})

async function build() {
  let ctx = await esbuild.context({
    entryPoints: ["src/react/index.tsx"],
    bundle: true,
    outfile: `public/${FRONTEND_NAME}.js`,
    platform: "browser",
    target: "es2020",
    format: "esm",
    minify: !isDev,
    sourcemap: isDev,
    jsx: "automatic",
    plugins: [
      tailwind({
        config: "tailwind.config.js",
        cssModulesEnabled: true,
        postcssPlugins: [
          postcssImport,
          tailwindNesting,
          tailwindcss,
          autoprefixer,
        ],
        cssModulesExcludePaths: ["styles.css"],
      }),
      svgr({
        typescript: true,
      }),
      {
        name: "on-rebuild",
        setup(build) {
          if (args.watch) {
            build.onEnd(() => {
              console.log("Frontend rebuilt")
              fs.writeFileSync(
                "public/rebuild-trigger.json",
                JSON.stringify({ timestamp: Date.now() }),
              )
              writePublicFilesToCode()
            })
          }
        },
      },
    ],
  })

  if (args.watch) {
    console.log("Watching and rebuilding frontend...")
    await ctx.watch()
  } else {
    await ctx.rebuild()
    writePublicFilesToCode()
    console.log("Frontend built")
    process.exit(0)
  }
}

build().catch((err) => {
  console.error("Error:", err)
  process.exit(1)
})

const writePublicFilesToCode = () => {
  const publicDir = path.resolve(__dirname, "../public")
  const outputFile = path.resolve(__dirname, "../src/public.generated.ts")
  const paths = {}

  const getMimeType = (ext) => {
    const mimeTypes = {
      ".html": "text/html",
      ".css": "text/css",
      ".js": "application/javascript",
      ".json": "application/json",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".ico": "image/x-icon",
    }
    return mimeTypes[ext] || "application/octet-stream"
  }

  const processFile = (file) => {
    const filePath = `${publicDir}/${file}`
    const ext = path.extname(file)
    const mimeType = getMimeType(ext)
    const data = fs.readFileSync(filePath, "utf-8")
    paths[`/${file}`] = { mimeType, data }
  }

  fs.readdirSync(publicDir).forEach(processFile)

  const content = `
export interface PathData {
  mimeType: string;
  data: string;
}

export const paths: Record<string, PathData> = ${JSON.stringify(paths, null, 2)};`
  fs.writeFileSync(outputFile, content)
}
