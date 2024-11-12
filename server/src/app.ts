import cors from "@elysiajs/cors"
import swagger from "@elysiajs/swagger"
import { Elysia } from "elysia"

// @ts-ignore
import { renderToReadableStream } from "react-dom/server.browser"

import { Cron } from "cron-async"
import { createElement } from "react"
import { createApi } from "./api"
import { db } from "./db"
import { env, envClient, isProd } from "./env"
import { verifyJwt } from "./lib/jwt"
import { createLog, createRequestLogger } from "./lib/logger"
import { Mailer } from "./lib/mailer"
import { paths as publicPaths } from "./public.generated"
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
  replyToAddress: env.MAILGUN_REPLY_TO,
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
  .get("/*", async ({ params, request }) => {
    const p = params["*"]
    if (`/${p}` in publicPaths) {
      return new Response(publicPaths[`/${p}`].data, {
        headers: { "Content-Type": publicPaths[`/${p}`].mimeType },
      })
    }

    // create our react App component
    const url = new URL(request.url)
    const app = createElement(App, {
      path: params["*"],
      serverUrl: url.origin,
      envClient: envClient,
    })

    // render the app component to a readable stream
    const stream = await renderToReadableStream(app, {
      bootstrapModules: ["/frontend.js"],
      bootstrapScriptContent: `
        window.__ENV = ${JSON.stringify(envClient)};
      `,
    })

    // output the stream as the response
    return new Response(stream, {
      headers: { "Content-Type": "text/html" },
    })
  })

export type ServerApp = typeof app
