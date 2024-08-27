import { eq } from "drizzle-orm"

import Elysia, { t } from "elysia"
import { users } from "../db/schema"
import {
  generateVerificationCodeAndBlob,
  verifyCodeWithBlob,
} from "../lib/emailVerification"
import { signJwt } from "../lib/jwt"
import type { GlobalContext } from "../types"
import { dateNow } from "../utils/date"
import { generateUsernameFromEmail } from "../utils/string"
import { execHandler, getLoggedInUser } from "./utils"

const userResponseType = t.Object({
  id: t.Number(),
  name: t.String(),
})

export const createUserRoutes = (ctx: GlobalContext) => {
  const { db } = ctx

  return new Elysia({ prefix: "/users" })
    .get("/check", async ({ ...props }) => {
      return await execHandler(async () => {
        const user = getLoggedInUser(props)
        if (user) {
          // check that user actually exists
          const [userExists] = await db
            .select({
              id: users.id,
            })
            .from(users)
            .where(eq(users.id, user.id))
            .limit(1)
          return userExists ? { user: { id: user.id, name: user.name } } : {}
        }
        return {}
      })
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
        response: t.Object({
          blob: t.String(),
        }),
      },
    )
    .post(
      "/verify_email",
      async ({ body }) => {
        return await execHandler(async () => {
          const { blob, code } = body

          const email = await verifyCodeWithBlob(ctx.log, blob, code)
          const name = generateUsernameFromEmail(email)

          const [user] = await db
            .insert(users)
            .values({
              name,
              email,
              lastLoggedIn: dateNow(),
              createdAt: dateNow(),
              updatedAt: dateNow(),
            })
            .onConflictDoUpdate({
              target: users.email,
              set: {
                lastLoggedIn: dateNow(),
                updatedAt: dateNow(),
              },
            })
            .returning({
              id: users.id,
              name: users.name,
            })

          return {
            user,
            jwt: await signJwt({
              id: user.id,
              name,
            }),
          }
        })
      },
      {
        body: t.Object({
          blob: t.String(),
          code: t.String(),
        }),
        response: t.Object({
          jwt: t.String(),
          user: userResponseType,
        }),
      },
    )
}
