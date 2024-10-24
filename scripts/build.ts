import path from "path"
import { execa } from "execa"
import pc from "picocolors"

async function runBuild(directory: string) {
  console.log(pc.blue(`Running build in ${directory}...`))
  await execa("bun", ["run", "build"], {
    cwd: path.join(__dirname, "..", directory),
    stdio: "inherit",
  })
  console.log(pc.green(`Build completed in ${directory}`))
}

async function buildAll() {
  await runBuild("client")
  await runBuild("server")
}

buildAll()
