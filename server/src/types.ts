import type { Database } from "./db"
import type { LogInterface } from "./lib/logger"
import type { Mailer } from "./lib/mailer"

export type GlobalContext = {
  db: Database
  mailer: Mailer
  log: LogInterface
}

export enum Sort {
  newest_first = "nf",
  oldest_first = "of",
  highest_score = "hs",
  lowest_score = "ls",
  most_replies = "mr",
  least_replies = "lr",
}

export type CommentUser = {
  id: number
  username: string
}
