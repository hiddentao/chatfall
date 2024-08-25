import cors from "@elysiajs/cors"
import swagger from "@elysiajs/swagger"
import { Elysia, t } from "elysia"

import { db } from "./db"
import { env, isProd } from "./env"
import { createLog, createRequestLogger } from "./lib/logger"
import { Mailer } from "./lib/mailer"
import { createApi } from "./routes"
import { pluginConditionally } from "./utils/elysia"
import { createSocket } from "./ws"

const log = createLog({
  name: "@",
  minlogLevel: env.LOG_LEVEL,
})

const mailer = new Mailer({
  log: log.create("mailer"),
  apiKey: env.MAILGUN_API_KEY,
  fromAddress: env.MAILGUN_SENDER,
})

const ctx = { mailer, log, db }

export const app = new Elysia({
  websocket: {
    idleTimeout: 120,
    perMessageDeflate: true,
  },
})
  .use(pluginConditionally(!isProd, createRequestLogger(log)))
  .use(
    cors({
      origin: "*",
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(swagger())
  .use(createApi(ctx))
  .use(createSocket(ctx))
