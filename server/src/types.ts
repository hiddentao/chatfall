import type { LogInterface } from "./lib/logger"
import type { Mailer } from "./lib/mailer"

export type { CommentUser } from "./exports"
export { Sort } from "./exports"

export type GlobalContext = {
  mailer: Mailer
  log: LogInterface
}
