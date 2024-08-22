import { isProd } from "../env"

export const testDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const execHandler = async (fn: any, delayMs: number = 2000) => {
  if (!isProd) {
    await testDelay(delayMs)
  }

  return fn()
}

export const getUserId = (props: any): number | undefined => {
  const { userId } = props as { userId: number }
  return userId
}
