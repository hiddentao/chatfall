import { and, asc, countDistinct, eq } from "drizzle-orm"

import Elysia, { t } from "elysia"
import { UserStatus, users } from "../db/schema"
import {
  generateVerificationCodeAndBlob,
  verifyCodeWithBlob,
} from "../lib/emailVerification"
import { signJwt } from "../lib/jwt"
import { Setting } from "../settings/types"
import type { GlobalContext } from "../types"
import { dateNow } from "../utils/date"
import { generateUsernameFromEmail, isSameEmail } from "../utils/string"
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
          // check that user actually exists and is active
          const [userExists] = await db
            .select({
              id: users.id,
            })
            .from(users)
            .where(
              and(eq(users.id, user.id), eq(users.status, UserStatus.active)),
            )
            .limit(1)
          return userExists ? { user: { id: user.id, name: user.name } } : {}
        }
        return {}
      })
    })
    .get("/has_admin", async () => {
      return await execHandler(async () => {
        const [user] = await db
          .select({
            id: users.id,
          })
          .from(users)
          .orderBy(asc(users.id))
          .limit(1)

        return !!user
      })
    })
    .post(
      "/login_email",
      async ({ body }) => {
        return await execHandler(async () => {
          const { email, adminOnly } = body

          const blockedEmails = ctx.settings.getSetting(
            Setting.BlacklistedEmails,
          )
          if (blockedEmails.find((e) => isSameEmail(e, email))) {
            throw new Error("This email address has been blacklisted")
          }

          if (adminOnly) {
            const [user] = await db
              .select({
                email: users.email,
              })
              .from(users)
              .orderBy(asc(users.id))
              .limit(1)

            if (user && !isSameEmail(user.email, email)) {
              throw new Error("Must be an admin user")
            }
          }

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
          adminOnly: t.Optional(t.Boolean()),
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
              status: UserStatus.active,
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

          // if there is only 1 user then this user is an admin
          const numUsers = await db
            .select({ count: countDistinct(users.id) })
            .from(users)

          if (numUsers.length === 1 && numUsers[0].count === 1) {
            ctx.log.info(`Admin user created: ${user.name} - ${email}`)
          }

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
