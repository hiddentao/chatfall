export const testDelay = (ms?: number) =>
  new Promise((resolve) => setTimeout(resolve, ms || 2000))
