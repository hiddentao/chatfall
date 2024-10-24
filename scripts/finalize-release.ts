import { execa } from "execa"
import pc from "picocolors"

async function finalizeRelease() {
  try {
    console.log(pc.blue("Finalizing release..."))
    const { stdout } = await execa("bunx", [
      "release-please",
      "github-release",
      "--token",
      `${process.env.GITHUB_TOKEN}`,
      "--config-file",
      "release-please-config.json",
      "--manifest-file",
      "release-please-manifest.json",
      "--repo-url",
      "hiddentao/chatfall",
    ])

    console.log(stdout)

    console.log(pc.magenta("Release finalization completed."))
  } catch (error) {
    console.error(pc.red("Error finalizing release:"), error)
    if (error instanceof Error) {
      console.error(pc.red("Error message:"), error.message)
    }
    process.exit(1)
  }
}

finalizeRelease()
