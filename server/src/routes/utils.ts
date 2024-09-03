import { isProd } from "../env"
import type { LoggedInUser } from "../types"

export const testDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const execHandler = async (fn: any, delayMs: number = 2000) => {
  if (!isProd) {
    await testDelay(delayMs)
  }

  return fn()
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
