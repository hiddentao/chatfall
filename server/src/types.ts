import type { Cron } from "cron-async"
import type { Database } from "./db"
import type { LogInterface } from "./lib/logger"
import type { Mailer } from "./lib/mailer"
import type { SettingsManager } from "./settings"
import type { SocketManager } from "./ws"

export type Settings = {
  userNextCommentDelayMs: number
}

export type GlobalContext = {
  cron: Cron
  db: Database
  mailer: Mailer
  log: LogInterface
  sockets: SocketManager
  settings: SettingsManager
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
  name: string
}

export type LoggedInUser = CommentUser

export type JwtTokenPayload = {
  id: number
}
