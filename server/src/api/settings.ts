import Elysia, { t } from "elysia"
import { Setting, type SettingValue } from "../settings"
import type { GlobalContext } from "../types"
import { execHandler, getLoggedInUserAndAssertAdmin } from "./utils"

export const createSettingsRoutes = (ctx: GlobalContext) => {
  return (
    new Elysia({ prefix: "/settings" })
      // .onRequest(async ({ set, ...props }) => {
      //   const user = await getLoggedInUserAndAssertAdmin(ctx, props)
      //   if (user) {
      //     throw new Error("test")
      //   }
      // })
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
  )
}
