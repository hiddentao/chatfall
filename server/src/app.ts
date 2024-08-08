import cors from "@elysiajs/cors"
import swagger from "@elysiajs/swagger"
import { Elysia } from "elysia"

import { api } from "./api"
import { isProd } from "./env"
import { logger } from "./lib/logger"
import { pluginConditionally } from "./utils/elysia"

export const app = new Elysia()
  .use(pluginConditionally(!isProd, logger))
  .use(
    cors({
      origin: "*",
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(swagger())
  .use(api)
