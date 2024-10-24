import { execa } from "execa"

async function runBuildCommand() {
  await execa("bun", ["scripts/build-server-frontend.js"], {
    env: { NODE_ENV: "production" },
    stdio: "inherit",
  })

  await execa("bun", ["scripts/build-server-prod.ts"], {
    env: { NODE_ENV: "production" },
    stdio: "inherit",
  })
}

runBuildCommand().catch(console.error)
