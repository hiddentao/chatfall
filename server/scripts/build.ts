import { execa } from "execa"

async function runBuildCommand() {
  const serverFrontendBuildProcess = execa(
    "bun",
    ["scripts/build-server-frontend.js"],
    {
      env: { NODE_ENV: "production" },
      stdio: "inherit",
    },
  )

  const serverBuildProcess = execa("bun", ["scripts/build-server-prod.ts"], {
    env: { NODE_ENV: "production" },
    stdio: "inherit",
  })

  await Promise.all([serverFrontendBuildProcess, serverBuildProcess])
}

runBuildCommand().catch(console.error)
