import fs from "fs"
import path from "path"
import { migrate as drizzleMigrate } from "drizzle-orm/node-postgres/migrator"
import pc from "picocolors"
import { dirSync } from "tmp"
import { db } from "./index"
import { migrationData } from "./migration-data"

export const migrate = async () => {
  const tmpDir = dirSync({ unsafeCleanup: true })
  console.log(pc.blue(`Temporary migrations folder: ${tmpDir.name}`))

  const migrationsFolder = tmpDir.name

  // Populate the temporary folder with migration data
  for (const [filePath, content] of Object.entries(migrationData)) {
    const fullPath = path.join(migrationsFolder, filePath)
    fs.mkdirSync(path.dirname(fullPath), { recursive: true })
    fs.writeFileSync(fullPath, content as string)
  }

  try {
    await drizzleMigrate(db, { migrationsFolder })
    console.log(pc.green("Migration successful"))
  } catch (err) {
    console.error(pc.red("Migration failed:"), err)
  } finally {
    tmpDir.removeCallback()
  }
}
