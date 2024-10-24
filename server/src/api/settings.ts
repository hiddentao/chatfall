import Elysia, { t } from "elysia"
import { Setting, type SettingValue } from "../settings/types"
import type { GlobalContext } from "../types"
import { execHandler, getLoggedInUserAndAssertAdmin } from "./utils"

export const createSettingsRoutes = (ctx: GlobalContext) => {
  return new Elysia({ prefix: "/settings" })
    .get("/", async ({ ...props }) => {
      return await execHandler(async () => {
        await getLoggedInUserAndAssertAdmin(ctx, props)
        return ctx.settings.getSettings()
      })
    })
    .put(
      "/",
      async ({ body, ...props }) => {
        return await execHandler(async () => {
          await getLoggedInUserAndAssertAdmin(ctx, props)
          const { key } = body
          const value = body.value as SettingValue<typeof body.key>
          await ctx.settings.setSetting(key, value)
          return ctx.settings.getSettings()
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
