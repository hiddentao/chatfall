import pc from "picocolors"

import { app } from "./app"
import { env } from "./env"

const CHATFALL_VERSION = import.meta.require("../../package.json").version

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
      `🦊 ${pc.green(`${pc.bold("Chatfall")} v${CHATFALL_VERSION}`)} ${pc.gray("started in")} ${pc.bold(duration.toFixed(2))} ms\n`,
    )
    console.log(
      `${pc.green(" ➜ ")} ${pc.bold("Server")}:   ${pc.cyan(String(server.url))}`,
    )
  },
)
