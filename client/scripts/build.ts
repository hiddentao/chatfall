import path from "path"
import { execa } from "execa"

async function runBuildCommand() {
  const cwd = path.join(__dirname, "..")

  await execa("tsc", ["-b"], {
    stdio: "inherit",
    cwd,
  })

  await execa("vite", ["build"], {
    stdio: "inherit",
    cwd,
  })

  await execa(
    `cp -rf ${path.resolve(cwd, "dist", "*")} ${path.resolve(cwd, "..", "server", "public")}`,
    {
      stdio: "inherit",
      cwd,
      shell: true,
    },
  )
}

runBuildCommand().catch((error) => {
  console.error(error)
  process.exit(1)
})
