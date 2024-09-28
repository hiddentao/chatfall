import type { Cron } from "cron-async"
import type { Database } from "./db"
import type { UserStatus } from "./db/schema"
import type { LogInterface } from "./lib/logger"
import type { Mailer } from "./lib/mailer"
import type { SettingsManager } from "./settings"
import type { SocketManager } from "./ws"

export type GlobalContext = {
  cron: Cron
  db: Database
  mailer: Mailer
  log: LogInterface
  sockets: SocketManager
  settings: SettingsManager
}

export enum Sort {
  newestFirst = "nf",
  oldestFirst = "of",
  highestScore = "hs",
  lowestScore = "ls",
  mostReplies = "mr",
  leastReplies = "lr",
}

export type CommentUser = {
  id: number
  name: string
  status: UserStatus
}

export type LoggedInUser = {
  id: number
  name: string
}

export type PostCommentResponse = { message: string; alert: boolean }
