import jwt from "@elysiajs/jwt"
import Elysia from "elysia"
import { env } from "../env"
import type { GlobalContext } from "../types"
import { createCommentRoutes } from "./comments"
import { createUserRoutes } from "./users"

export const createApi = (ctx: GlobalContext) => {
  return new Elysia({
    prefix: "/api",
  })
    .use(
      jwt({
        name: "jwt",
        secret: env.ENC_KEY,
      }),
    )
    .derive(async ({ headers, jwt }) => {
      const auth = headers["authorization"]

      const jwtToken = auth?.startsWith("Bearer ") ? auth.slice(7) : null
      if (jwtToken) {
        try {
          const { id } = (await jwt.verify(jwtToken)) as { id: number }
          return { userId: id }
        } catch (err) {
          ctx.log.error(`Error verifying JWT token`, err)
        }
      }
    })
    .use(createCommentRoutes(ctx))
    .use(createUserRoutes(ctx))
}
