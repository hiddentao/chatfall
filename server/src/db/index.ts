import { drizzle } from "drizzle-orm/node-postgres"
import { Client } from "pg"
import { env } from "../env"
import * as schema from "./schema"

const sanitizedConnectionOptions = (connStr: string) => {
  // if sslmode=require exists then remove it, but also set rejectUnauthorized to false
  const sslMode = connStr.match(/sslmode=require/)
  if (sslMode) {
    connStr = connStr.replace(/sslmode=require/, "")
    return {
      connectionString: connStr,
      ssl: {
        rejectUnauthorized: false,
      },
    }
  } else {
    return {
      connectionString: connStr,
    }
  }
}

const client = new Client(sanitizedConnectionOptions(env.DATABASE_URL))

client.connect().catch((err) => {
  console.error("Error connecting to database", err)
  process.exit(1)
})

export const db = drizzle(client, {
  schema,
  logger: process.env.NODE_ENV === "development",
})

export type Database = typeof db
