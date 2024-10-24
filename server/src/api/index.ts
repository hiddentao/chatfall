import Elysia from "elysia"
import type { GlobalContext } from "../types"
import { createCommentRoutes } from "./comments"
import { createSettingsRoutes } from "./settings"
import { createUserRoutes } from "./users"

export const createApi = (ctx: GlobalContext) => {
  return new Elysia({
    prefix: "/api",
  })
    .use(createCommentRoutes(ctx))
    .use(createUserRoutes(ctx))
    .use(createSettingsRoutes(ctx))
}
