import Elysia, { t } from "elysia"

import { users } from "../db/schema"
import { env } from "../env"
import {
  generateVerificationCodeAndBlob,
  verifyCodeWithBlob,
} from "../lib/emailVerification"
import type { GlobalContext } from "../types"
import { dateNow } from "../utils/date"
import { execHandler, getUserId, testDelay } from "./utils"

export const createUserRoutes = (ctx: GlobalContext) => {
  const { db } = ctx

  return new Elysia({ prefix: "/users" })
    .get("/check", async ({ ...props }) => {
      const userId = getUserId(props)
      return {
        id: userId ?? null,
      }
    })
    .post(
      "/login_email",
      async ({ body }) => {
        return await execHandler(async () => {
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
        })
      },
      {
        body: t.Object({
          email: t.String(),
        }),
      },
    )
    .post(
      "/verify_email",
      async ({ body, ...props }) => {
        const { jwt } = props as any

        return await execHandler(async () => {
          const { blob, code } = body

          const email = await verifyCodeWithBlob(ctx.log, blob, code)

          const [user] = await db
            .insert(users)
            .values({
              name: email,
              email,
              lastLoggedIn: dateNow(),
              createdAt: dateNow(),
              updatedAt: dateNow(),
            })
            .onConflictDoUpdate({
              target: users.name,
              set: {
                lastLoggedIn: dateNow(),
                updatedAt: dateNow(),
              },
            })
            .returning({
              id: users.id,
            })

          return {
            id: user.id,
            jwt: await jwt.sign({ id: user.id }),
          }
        })
      },
      {
        body: t.Object({
          blob: t.String(),
          code: t.String(),
        }),
      },
    )
}
