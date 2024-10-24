import { execa } from "execa"

const commonOptions = {
  env: { NODE_ENV: "production" },
  stdio: "inherit",
} as any

async function runBuildCommand() {
  await execa("bun", ["scripts/generate-migration-data.ts"], commonOptions)

  await execa("bun", ["scripts/build-server-frontend.js"], commonOptions)

  await execa("bun", ["scripts/build-server-prod.ts"], commonOptions)
}

runBuildCommand()
