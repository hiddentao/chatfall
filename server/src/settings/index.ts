import type { Cron } from "cron-async"
import { eq } from "drizzle-orm"
import type { Database } from "../db"
import { settings } from "../db/schema"
import type { LogInterface } from "../lib/logger"

export enum Setting {
  CommentsPerPage = "commentsPerPage",
  UserNextCommentDelayMs = "userNextCommentDelayMs",
  BlacklistedWords = "blacklistedWords",
  BlacklistedEmails = "blacklistedEmails",
  BlacklistedDomains = "blacklistedDomains",
  FlaggedWords = "flaggedWords",
  ModerateAllComments = "moderateAllComments",
}

// Define a mapped type for setting values
type SettingValueMap = {
  [Setting.CommentsPerPage]: number
  [Setting.UserNextCommentDelayMs]: number
  [Setting.BlacklistedWords]: string[]
  [Setting.BlacklistedEmails]: string[]
  [Setting.BlacklistedDomains]: string[]
  [Setting.FlaggedWords]: string[]
  [Setting.ModerateAllComments]: boolean
}

// Create a type that maps the enum to its corresponding value type
type SettingValue<T extends Setting> = SettingValueMap[T]

type SettingValueRaw = boolean | number | string | string[]

export class SettingsManager {
  private log: LogInterface
  private db: Database
  private settings: Record<string, SettingValueRaw> = {
    [Setting.CommentsPerPage]: 10,
    [Setting.UserNextCommentDelayMs]: 60000,
    [Setting.BlacklistedWords]: [],
    [Setting.BlacklistedEmails]: [],
    [Setting.BlacklistedDomains]: [],
    [Setting.FlaggedWords]: [],
    [Setting.ModerateAllComments]: false,
  }

  constructor(cfg: { db: Database; log: LogInterface; cron: Cron }) {
    this.log = cfg.log
    this.db = cfg.db
    this._reload()
  }

  private async _reload() {
    this.log.debug(`Loading settings`)

    const rows = await this.db.select().from(settings)

    if (settings) {
      this.settings = rows.reduce((acc, row) => {
        acc[row.key] = JSON.parse(row.value)
        return acc
      }, this.settings)
    }
  }

  public getSetting<K extends Setting>(key: K): SettingValue<K> {
    return this.settings[key] as SettingValue<K>
  }

  public async setSetting<K extends Setting>(key: K, value: SettingValue<K>) {
    await this.db
      .update(settings)
      .set({ value: JSON.stringify(value) })
      .where(eq(settings.key, key))

    this.settings[key] = value
  }
}
