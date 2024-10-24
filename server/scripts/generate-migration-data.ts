import fs from "fs"
import path from "path"

const drizzleDir = path.resolve(__dirname, "../src/db/migrations")
const dbDir = path.resolve(__dirname, "../src/db")
const outputFile = path.resolve(dbDir, "migration-data.generated.ts")

function readDrizzleFiles(): { [key: string]: string } {
  const files: { [key: string]: string } = {}

  // Read meta/_journal.json
  const journalPath = path.join(drizzleDir, "meta", "_journal.json")
  const journalContent = fs.readFileSync(journalPath, "utf-8")
  files["meta/_journal.json"] = journalContent

  // Parse journal to get SQL file names
  const journal = JSON.parse(journalContent)
  const sqlFileNames = journal.entries.map(
    (entry: { tag: string }) => `${entry.tag}.sql`,
  )

  // Read meta/0000_snapshot.json
  const snapshotPath = path.join(drizzleDir, "meta", "0000_snapshot.json")
  files["meta/0000_snapshot.json"] = fs.readFileSync(snapshotPath, "utf-8")

  // Read SQL files
  for (const sqlFileName of sqlFileNames) {
    const filePath = path.join(drizzleDir, sqlFileName)
    if (fs.existsSync(filePath)) {
      files[sqlFileName] = fs.readFileSync(filePath, "utf-8")
    } else {
      console.warn(`Warning: SQL file ${sqlFileName} not found.`)
    }
  }

  return files
}

const migrationData = readDrizzleFiles()

const fileContent = `
// This file is auto-generated. Do not edit manually.
export const migrationData: { [key: string]: string } = ${JSON.stringify(migrationData, null, 2)};
`

fs.writeFileSync(outputFile, fileContent)
console.log(`\nMigration data generated at ${outputFile}`)
