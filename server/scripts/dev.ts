import { execa } from "execa"

async function runDevCommand() {
  await execa("bun", ["scripts/build-server-frontend.js", "--watch"], {
    env: { NODE_ENV: "development" },
    stdio: "inherit",
  })

  await execa("bun", ["--hot", "--watch", "src/index.ts", "server"], {
    env: { NODE_ENV: "development" },
    stdio: "inherit",
  })
}

runDevCommand()
