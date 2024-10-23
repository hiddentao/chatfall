import path from "path"
import type { Config } from "drizzle-kit"

import { env } from "../env"

const dbCredentials = {
  url: env.DATABASE_URL,
}

export default {
  dbCredentials,
  dialect: "postgresql",
  out: "./migrations",
  breakpoints: true,
  schema: path.join(__dirname, "schema.ts"),
} satisfies Config
