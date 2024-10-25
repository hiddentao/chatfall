import path from "path"
import { execa } from "execa"
import pc from "picocolors"

async function publishNpm() {
  const clientDir = path.join(__dirname, "..", "client")

  console.log(pc.blue("Publishing NPM package from client/ folder..."))

  try {
    await execa("npm", ["publish", "--access", "public"], {
      cwd: clientDir,
      stdio: "inherit",
    })
    console.log(pc.green("NPM package published successfully"))
  } catch (error) {
    console.error(pc.red("Failed to publish NPM package:"), error)
    process.exit(-1)
  }
}

publishNpm()
