import fs from "fs"
import esbuild from "esbuild"

const isDev = process.env.NODE_ENV === "development"

async function watch() {
  let ctx = await esbuild.context({
    entryPoints: ["src/react/index.tsx"],
    bundle: true,
    outfile: "public/client.js",
    platform: "browser",
    target: "es2015",
    format: "esm",
    minify: !isDev,
    sourcemap: isDev,
    plugins: [
      {
        name: "on-rebuild",
        setup(build) {
          build.onEnd(() => {
            console.log("public/client.js rebuilt")
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
