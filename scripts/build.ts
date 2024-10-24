import path from "path"
import { execa } from "execa"
import pc from "picocolors"

async function runBuild(directory: string) {
  console.log(pc.blue(`Running build in ${directory}...`))
  await execa("bun", ["run", "build"], {
    cwd: path.join(process.cwd(), directory),
  })
  console.log(pc.green(`Build completed in ${directory}`))
}

async function buildAll() {
  try {
    await runBuild("client")
    await runBuild("server")
  } catch (error) {
    console.error(pc.red("Error creating release PR:"), error)
    if (error instanceof Error) {
      console.error(pc.red("Error message:"), error.message)
    }
    process.exit(1)
  }
}

buildAll()
