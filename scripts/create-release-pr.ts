import path from "path"
import { execa } from "execa"

async function runBuild(directory: string) {
  console.log(`Running build in ${directory}...`)
  await execa("bun", ["run", "build"], {
    cwd: path.join(process.cwd(), directory),
  })
}

async function createReleasePR() {
  try {
    await runBuild("client")
    await runBuild("server")

    console.log("Creating release PR...")
    const { stdout } = await execa("bunx", [
      "release-please",
      "release-pr",
      "--config-file",
      ".release-please-config.json",
      "--manifest-file",
      ".release-please-manifest.json",
      "--repo-url",
      "git@github.com:hiddentao/chatfall.git",
      "--monorepo-tags",
    ])

    console.log(stdout)
    console.log("Release PR process completed.")
  } catch (error) {
    console.error("Error creating release PR:", error)
    if (error instanceof Error) {
      console.error("Error message:", error.message)
    }
    process.exit(1)
  }
}

createReleasePR()
