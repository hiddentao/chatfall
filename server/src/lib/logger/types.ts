export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export interface LogConfig {
  name: string
  minlogLevel: string
}

export interface LoggerMethods {
  debug: (...args: any[]) => void
  info: (...args: any[]) => void
  warn: (...args: any[]) => void
  error: (...args: any[]) => void
  throw: (msg: string) => void
}

export interface LogInterface extends LoggerMethods {
  create: (name: string) => LogInterface
  flush: () => Promise<void>
}
