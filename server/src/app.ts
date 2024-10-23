import cors from "@elysiajs/cors"
import { staticPlugin } from "@elysiajs/static"
import swagger from "@elysiajs/swagger"
import { Elysia } from "elysia"

// @ts-ignore
import { renderToReadableStream } from "react-dom/server.browser"

import { Cron } from "cron-async"
import { createElement } from "react"
import { createApi } from "./api"
import { db } from "./db"
import { env, isProd } from "./env"
import { verifyJwt } from "./lib/jwt"
import { createLog, createRequestLogger } from "./lib/logger"
import { Mailer } from "./lib/mailer"
import { App } from "./react/App"
import { SettingsManager } from "./settings"
import { pluginConditionally } from "./utils/elysia"
import { SocketManager, createSocket } from "./ws"

const log = createLog({
  name: "@",
  minlogLevel: env.LOG_LEVEL,
})

const mailer = new Mailer({
  log: log.create("mailer"),
  apiKey: env.MAILGUN_API_KEY,
  fromAddress: env.MAILGUN_SENDER,
})

const cron = new Cron()

const settings = new SettingsManager({ db, log, cron })

const sockets = new SocketManager(log.create("sockets"))

const ctx = { mailer, log, db, sockets, cron, settings }

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
        const user = await verifyJwt(jwtToken)
        return { user }
      } catch (err) {
        ctx.log.error(`Error verifying JWT token`, err)
      }
    }
  })
  .use(createApi(ctx))
  .use(createSocket(ctx))
  .use(staticPlugin())
  .get("/*", async ({ params }) => {
    // create our react App component
    const app = createElement(App, { path: params["*"] })
    // render the app component to a readable stream
    const stream = await renderToReadableStream(app, {
      bootstrapModules: ["/public/frontend.js"],
    })
    // output the stream as the response
    return new Response(stream, {
      headers: { "Content-Type": "text/html" },
    })
  })

export type ServerApp = typeof app
