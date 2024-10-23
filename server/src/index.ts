import { Command } from "commander"
import pc from "picocolors"

import { app } from "./app"
import { migrate as migrateDb } from "./db/migrate"
import { env } from "./env"

const CHATFALL_VERSION = import.meta.require("../../package.json").version

async function startServer() {
  const startTime = performance.now()

  // clear screen
  process.stdout.write("\x1Bc\n")

  app.listen(
    {
      port: env.PORT,
      hostname: env.HOSTNAME,
    },
    (server) => {
      const duration = performance.now() - startTime

      console.log(
        `🦊 ${pc.green(`${pc.bold("Chatfall server")} v${CHATFALL_VERSION}`)} ${pc.gray("started in")} ${pc.bold(duration.toFixed(2))} ms\n`,
      )
      console.log(
        `${pc.green(" ➜ ")} ${pc.bold("Running at")}:   ${pc.cyan(String(server.url))}`,
      )
    },
  )
}

const program = new Command()

program
  .name("chatfall")
  .description("Chatfall commenting server")
  .version(CHATFALL_VERSION)

program
  .command("server")
  .description("Start the Chatfall server")
  .action(async () => {
    await startServer()
  })

program
  .command("migrate-db")
  .description("Setup and/or upgrade your database to the latest table schema")
  .action(async () => {
    await migrateDb()
    process.exit(0)
  })

// entry point
;(async function main() {
  await program.parseAsync(process.argv)
})().catch((error) => {
  console.error("Error:", error)
  process.exit(1)
})
