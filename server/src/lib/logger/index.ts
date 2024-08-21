import Elysia from "elysia"
import pc from "picocolors"
import { isProd } from "../../env"
import * as fmt from "./formatters"
import type { LogConfig, LogInterface } from "./types"

export type { LogInterface, LogConfig }

const { createLogger, format, transports } = require("winston")

class Log implements LogInterface {
  private _cfg: LogConfig
  private _log: unknown

  constructor(cfg: LogConfig) {
    this._cfg = cfg
    this._log = createLogger({
      format: format.combine(
        format.label({ label: this._cfg.name }),
        format.timestamp({
          format: isProd ? "YYYY-MM-DD HH:mm:ss" : "HH:mm:ss",
        }),
        format.colorize({ level: true }),
        format.printf((info: any) =>
          [
            pc.gray(info.timestamp),
            pc.bold(`[${info.label}]`),
            info.level,
            info.message,
          ].join(" "),
        ),
      ),
      transports: [
        new transports.Console({
          level: this._cfg.minlogLevel,
        }),
      ],
    })
  }
  debug(...args: any[]) {
    ;(this._log as any).debug(...args)
  }
  info(...args: any[]) {
    ;(this._log as any).info(...args)
  }
  warn(...args: any[]) {
    ;(this._log as any).warn(...args)
  }
  error(...args: any[]) {
    ;(this._log as any).error(...args)
  }

  throw(msg: string) {
    this.error(msg)
    throw new Error(msg)
  }

  create(name: string): LogInterface {
    return new Log({
      ...this._cfg,
      name: `${this._cfg.name}/${name}`,
    })
  }

  async flush() {
    // return Promise.all(
    //   this._opts.streams.map((s: any) => {
    //     if (s.stream && s.stream.flush) {
    //       return s.stream.flush()
    //     }
    //   }),
    // )
  }
}

export const createLog = (config: LogConfig): LogInterface => {
  return new Log({
    name: config.name || "root",
    minlogLevel: config.minlogLevel,
  })
}

export const createRequestLogger = (log: LogInterface) => {
  const requestLogger = log.create("req")

  const logResult = (isSuccess: boolean, args: any) => {
    const { request, set, store, error } = args

    const url = new URL(request.url)
    const duration = store.__requestStartTime
    const status = isSuccess
      ? set.status
      : "status" in error
        ? error.status
        : "-/-"

    const components = [
      isSuccess ? pc.green("✓") : pc.red("✗"),
      pc.bold(fmt.method(request.method)),
      url.pathname,
      fmt.status(status),
      pc.dim(`[${fmt.duration(duration)}]`),
    ]

    if (isSuccess) {
      requestLogger.debug(components.join(" "))
    } else {
      requestLogger.error(components.join(" "))
      requestLogger.error(error)
    }
  }

  return new Elysia({
    name: "@chatfall/server/logger",
  })
    .state("__requestStartTime", [Number.NaN, Number.NaN] as [number, number])
    .onRequest(({ store }) => {
      store.__requestStartTime = process.hrtime()
    })
    .onResponse({ as: "global" }, ({ request, set, store, error }) =>
      logResult(true, { request, set, store, error }),
    )
    .onError({ as: "global" }, ({ request, error, store }) =>
      logResult(false, { request, error, store }),
    )
}
