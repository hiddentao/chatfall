import path from "path"
import react from "@vitejs/plugin-react"
import { UserConfig, defineConfig } from "vite"
import dts from "vite-plugin-dts"
import svgr from "vite-plugin-svgr"

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  let ret: Partial<UserConfig> = {
    plugins: [react(), dts(), svgr()],
  }

  switch (command) {
    case "serve":
      ret = {
        ...ret,
        root: path.resolve(__dirname, "src/scaffold"),
      }
      break
    case "build":
      ret = {
        ...ret,
        define: {
          "process.env.NODE_ENV": '"production"',
        },
        build: {
          cssMinify: true,
          minify: "esbuild",
          outDir: "./dist",
          lib: {
            entry: "src/scaffold/index.tsx",
            formats: ["es"],
            fileName: (format) => `chatfall.${format}.js`,
          },
          rollupOptions: {
            output: {
              assetFileNames: (assetInfo) => {
                if (assetInfo.name === "style.css") return "chatfall.css"
                return assetInfo.name!
              },
            },
          },
        },
      }
      break
  }

  return ret
})
