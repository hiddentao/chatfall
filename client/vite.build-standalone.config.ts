import { defineConfig } from "vite"
import baseConfig from "./vite.config-base"

// https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig,
  build: {
    outDir: "./dist/lib",
    lib: {
      entry: "lib/index.tsx",
      formats: ["es"],
      fileName: (format) => `chatfall.${format}.js`,
    },
  },
})
