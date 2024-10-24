import { drizzle } from "drizzle-orm/node-postgres"
import { Client } from "pg"
import { env } from "../env"
import * as schema from "./schema"

const client = new Client({
  connectionString: env.DATABASE_URL,
})
client.connect().catch((err) => {
  console.error("Error connecting to database", err)
  process.exit(1)
})

export const db = drizzle(client, {
  schema,
  logger: process.env.NODE_ENV === "development",
})

export type Database = typeof db
