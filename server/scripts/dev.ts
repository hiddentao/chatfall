import { execa } from "execa"

async function runDevCommand() {
  // need to build the frontend first to run the server
  await execa("bun", ["scripts/build-server-frontend.js"], {
    env: { NODE_ENV: "development" },
    stdio: "inherit",
  })

  await Promise.all([
    execa("bun", ["--hot", "--watch", "src/index.ts", "server"], {
      env: { NODE_ENV: "development" },
      stdio: "inherit",
    }),
    execa("bun", ["scripts/build-server-frontend.js", "--watch"], {
      env: { NODE_ENV: "development" },
      stdio: "inherit",
    }),
  ])
}

runDevCommand()
