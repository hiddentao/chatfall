import path from "path"
import fs from "fs/promises"
import pc from "picocolors"

async function updateVersions() {
  const rootDir = path.join(__dirname, "..")
  const clientDir = path.join(rootDir, "client")
  const serverDir = path.join(rootDir, "server")

  try {
    const rootPackageJson = JSON.parse(
      await fs.readFile(path.join(rootDir, "package.json"), "utf-8"),
    )
    const rootVersion = rootPackageJson.version

    console.log(
      pc.blue(
        `Updating version to ${rootVersion} in client and server package.json files...`,
      ),
    )

    for (const dir of [clientDir, serverDir]) {
      const packageJsonPath = path.join(dir, "package.json")
      const packageJson = JSON.parse(
        await fs.readFile(packageJsonPath, "utf-8"),
      )

      packageJson.version = rootVersion
      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2))

      console.log(
        pc.green(
          `Updated ${path.relative(rootDir, packageJsonPath)} to version ${rootVersion}`,
        ),
      )
    }

    console.log(pc.green("Version update completed successfully"))
  } catch (error) {
    console.error(pc.red("Failed to update versions:"), error)
    process.exit(-1)
  }
}

updateVersions()
