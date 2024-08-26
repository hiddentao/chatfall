import type { Cron } from "cron-async"
import { eq } from "drizzle-orm"
import type { Database } from "../db"
import { settings } from "../db/schema"
import type { LogInterface } from "../lib/logger"

export enum Setting {
  UserNextCommentDelayMs = "userNextCommentDelayMs",
}

// Define a mapped type for setting values
type SettingValueMap = {
  [Setting.UserNextCommentDelayMs]: number
}

// Create a type that maps the enum to its corresponding value type
type SettingValue<T extends Setting> = SettingValueMap[T]

export class SettingsManager {
  private log: LogInterface
  private db: Database
  private settings: Record<string, number | string> = {
    [Setting.UserNextCommentDelayMs]: 60000, // 1 minute by default
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
      this.settings = rows.reduce(
        (acc, row) => {
          acc[row.key] = JSON.parse(row.value)
          return acc
        },
        {} as Record<string, number | string>,
      )
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