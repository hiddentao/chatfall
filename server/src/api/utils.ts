import { asc } from "drizzle-orm"
import { users } from "../db/schema"
import { isProd } from "../env"
import type { GlobalContext, LoggedInUser } from "../types"

export const testDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const execHandler = async (fn: any, delayMs: number = 2000) => {
  if (!isProd) {
    await testDelay(delayMs)
  }

  return fn()
}

export const getAdminUser = async (db: GlobalContext["db"]) => {
  const [admin] = await db.select().from(users).orderBy(asc(users.id)).limit(1)

  if (!admin) {
    throw new Error("No admin user found")
  }

  return admin
}

export const getLoggedInUser = (props: any): LoggedInUser | undefined => {
  const { user } = props as { user: LoggedInUser }
  return user
}

export const getLoggedInUserAndAssert = (props: any): LoggedInUser => {
  const user = getLoggedInUser(props)
  if (!user) {
    throw new Error("You must be logged in")
  }
  return user
}

export const getLoggedInUserAndAssertAdmin = async (
  ctx: GlobalContext,
  props: any,
): Promise<LoggedInUser> => {
  const user = getLoggedInUser(props)
  if (!user) {
    throw new Error("You must be logged in")
  }
  //  check is admin by checking the db
  const admin = await getAdminUser(ctx.db)

  if (user.id !== admin.id) {
    throw new Error("You are not authorized to access this resource")
  }
  return user
}
