import { execa } from "execa"
import pc from "picocolors"

const folders = ["client", "server"]

async function runChecks() {
  for (const folder of folders) {
    console.log(pc.blue(`Running check in ${folder}...`))
    try {
      await execa("bun", ["run", "check"], { cwd: folder, stdio: "inherit" })
    } catch (error) {
      console.error(pc.red(`Check failed in ${folder}`), error)
      process.exit(-1)
    }
  }
  console.log(pc.green("All checks completed successfully."))
}

runChecks()
