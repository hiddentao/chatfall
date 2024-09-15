import fs from "fs"
import autoprefixer from "autoprefixer"
import esbuild from "esbuild"
import svgr from "esbuild-plugin-svgr"
import tailwind from "esbuild-plugin-tailwind"
import postcssImport from "postcss-import"
import tailwindcss from "tailwindcss"
import tailwindNesting from "tailwindcss/nesting/index.js"

const isDev = process.env.NODE_ENV === "development"

async function watch() {
  let ctx = await esbuild.context({
    entryPoints: ["src/react/index.tsx"],
    bundle: true,
    outfile: "public/client.js",
    platform: "browser",
    target: "es2020",
    format: "esm",
    minify: !isDev,
    sourcemap: isDev,
    jsx: "automatic",
    plugins: [
      tailwind({
        config: "./tailwind.config.js",
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
          build.onEnd(() => {
            console.log("client rebuilt")
            fs.writeFileSync(
              "public/rebuild-trigger.json",
              JSON.stringify({ timestamp: Date.now() }),
            )
          })
        },
      },
    ],
  })

  await ctx.watch()
}

watch().catch((err) => {
  console.error("Error:", err)
  process.exit(1)
})
