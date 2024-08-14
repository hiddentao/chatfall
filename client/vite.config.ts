import path from "path"
import react from "@vitejs/plugin-react"
import { ConfigEnv, UserConfig, defineConfig } from "vite"
import dts from "vite-plugin-dts"
import svgr from "vite-plugin-svgr"

const workspaceRootFolder = path.resolve(__dirname, "..")

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
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
          cssMinify: false,
          outDir: "./dist/lib",
          lib: {
            entry: "lib/index.tsx",
            formats: ["es"],
            fileName: (format) => `chatfall.${format}.js`,
          },
        },
      }
      break
  }

  return ret
})
