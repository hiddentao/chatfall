import { execa } from "execa"

async function runDevCommand() {
  const serverFrontendBuildProcess = execa(
    "bun",
    ["scripts/build-server-frontend.js", "--watch"],
    {
      env: { NODE_ENV: "development" },
      stdio: "inherit",
    },
  )

  const serverProcess = execa(
    "bun",
    ["--hot", "--watch", "src/index.ts", "server"],
    {
      env: { NODE_ENV: "development" },
      stdio: "inherit",
    },
  )

  await Promise.all([serverFrontendBuildProcess, serverProcess])
}

runDevCommand().catch(console.error)
