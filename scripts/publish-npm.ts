import path from "path"
import { execa } from "execa"
import fs from "fs/promises"
import pc from "picocolors"

// Inside this repo the client package points at its source files, which import
// from the unpublished @chatfall/server workspace package. The published
// package instead points at the bundle in dist/, which already contains all
// its dependencies, so they are removed from the published package.json.
function toPublishedPackageJson(packageJson: Record<string, any>) {
  const published = {
    ...packageJson,
    module: "./dist/chatfall.es.js",
    types: "./types/chatfall.d.ts",
    exports: {
      ".": {
        types: "./types/chatfall.d.ts",
        import: "./dist/chatfall.es.js",
      },
      "./chatfall.css": "./dist/chatfall.css",
      "./dist/*": "./dist/*",
      "./package.json": "./package.json",
    },
  }
  delete published.dependencies
  return published
}

async function publishNpm() {
  const clientDir = path.join(__dirname, "..", "client")
  const packageJsonPath = path.join(clientDir, "package.json")
  const originalPackageJson = await fs.readFile(packageJsonPath, "utf-8")

  console.log(pc.blue("Publishing NPM package from client/ folder..."))

  let failed = false
  try {
    await fs.writeFile(
      packageJsonPath,
      JSON.stringify(
        toPublishedPackageJson(JSON.parse(originalPackageJson)),
        null,
        2,
      ),
    )
    // Extra arguments (e.g. --dry-run) are passed on to npm publish
    await execa(
      "npm",
      ["publish", "--access", "public", ...process.argv.slice(2)],
      {
        cwd: clientDir,
        stdio: "inherit",
      },
    )
    console.log(pc.green("NPM package published successfully"))
  } catch (error) {
    console.error(pc.red("Failed to publish NPM package:"), error)
    failed = true
  } finally {
    await fs.writeFile(packageJsonPath, originalPackageJson)
  }

  if (failed) {
    process.exit(-1)
  }
}

publishNpm()
