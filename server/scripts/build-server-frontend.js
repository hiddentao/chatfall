import fs from "fs"
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

async function build() {
  let ctx = await esbuild.context({
    entryPoints: ["src/react/index.tsx"],
    bundle: true,
    outfile: "public/frontend.js",
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
    console.log("Frontend built")
    process.exit(0)
  }
}

build().catch((err) => {
  console.error("Error:", err)
  process.exit(1)
})
