import cors from "@elysiajs/cors"
import swagger from "@elysiajs/swagger"
import { Elysia, t } from "elysia"

import { db } from "./db"
import { env, isProd } from "./env"
import { verifyJwt } from "./lib/jwt"
import { createLog, createRequestLogger } from "./lib/logger"
import { Mailer } from "./lib/mailer"
import { createApi } from "./routes"
import type { JwtTokenPayload } from "./types"
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

const ctx = { mailer, log, db, sockets: {}, userSockets: {} }

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
  .derive(async ({ headers }) => {
    const auth = headers["authorization"]

    const jwtToken = auth?.startsWith("Bearer ") ? auth.slice(7) : null
    if (jwtToken) {
      try {
        const { id } = await verifyJwt<JwtTokenPayload>(jwtToken)
        return { userId: id }
      } catch (err) {
        ctx.log.error(`Error verifying JWT token`, err)
      }
    }
  })
  .use(createApi(ctx))
  .use(createSocket(ctx))
