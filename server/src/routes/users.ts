import Elysia, { t } from "elysia"

import { generateVerificationCodeAndBlob } from "../lib/emailVerification"
import type { GlobalContext } from "../types"
import { testDelay } from "./utils"

export const createUserRoutes = (ctx: GlobalContext) => {
  return new Elysia({ prefix: "/users" }).post(
    "/login_email",
    async ({ body }) => {
      await testDelay()

      const { email } = body

      const data = await generateVerificationCodeAndBlob(ctx.log, email)

      await ctx.mailer.send({
        to: email,
        subject: "Verify your email",
        text: `Your verification code is: ${data.code}`,
      })

      return {
        blob: data.blob,
      }
    },
    {
      body: t.Object({
        email: t.String(),
      }),
    },
  )
}
