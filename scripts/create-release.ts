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

async function createRelease() {
  try {
    await runBuild("client")
    await runBuild("server")

    console.log(pc.blue("Creating release PR..."))
    const { stdout } = await execa("bunx", [
      "release-please",
      "release-pr",
      "--token",
      `${process.env.GITHUB_TOKEN}`,
      "--config-file",
      "release-please-config.json",
      "--manifest-file",
      "release-please-manifest.json",
      "--repo-url",
      "hiddentao/chatfall",
      "--monorepo-tags",
    ])

    console.log(stdout)

    console.log(pc.magenta("Release PR process completed."))
  } catch (error) {
    console.error(pc.red("Error creating release PR:"), error)
    if (error instanceof Error) {
      console.error(pc.red("Error message:"), error.message)
    }
    process.exit(1)
  }
}

createRelease()
