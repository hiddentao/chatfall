import Elysia, { t } from "elysia"
import { Setting, type SettingValue } from "../settings"
import type { GlobalContext } from "../types"
import { execHandler } from "./utils"

export const createSettingsRoutes = (ctx: GlobalContext) => {
  return new Elysia({ prefix: "/settings" })
    .get("/", async () => {
      return await execHandler(async () => {
        return ctx.settings.getSettings()
      })
    })
    .put(
      "/",
      async ({ body }) => {
        return await execHandler(async () => {
          const { key } = body
          const value = body.value as SettingValue<typeof body.key>
          await ctx.settings.setSetting(key, value)
          return { message: "Setting updated successfully" }
        })
      },
      {
        body: t.Object({
          key: t.Enum(Setting),
          value: t.Union([
            t.Number(),
            t.Boolean(),
            t.String(),
            t.Array(t.String()),
          ]),
        }),
      },
    )
}
