import type { Cron } from "cron-async"
import { and, eq, inArray, ne } from "drizzle-orm"
import { getAdminUser } from "../api/utils"
import type { Database } from "../db"
import { settings, userStatusEnum, users } from "../db/schema"
import { dateNow } from "../exports"
import type { LogInterface } from "../lib/logger"
import { isSameEmail } from "../utils/string"
import {
  Setting,
  type SettingValue,
  type SettingValueRaw,
  type Settings,
} from "./types"

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

  public getSettings(): Settings {
    return { ...this.settings } as Settings
  }

  public async setSetting<K extends Setting>(key: K, value: SettingValue<K>) {
    const now = dateNow()

    const admin = await getAdminUser(this.db)

    switch (key) {
      case Setting.BlacklistedEmails: {
        if (
          (value as SettingValue<Setting.BlacklistedEmails>).find((v) =>
            isSameEmail(v, admin.email),
          )
        ) {
          throw new Error(`Cannot blacklist admin user: ${admin.email}`)
        }

        await this.db
          .update(users)
          .set({ status: userStatusEnum.deleted, updatedAt: dateNow() })
          .where(
            and(
              inArray(
                users.email,
                (value as SettingValue<Setting.BlacklistedEmails>).map((v) =>
                  v.toLowerCase(),
                ),
              ),
              eq(users.status, userStatusEnum.active),
              ne(users.id, admin.id),
            ),
          )
        break
      }
    }

    await this.db
      .insert(settings)
      .values({
        key,
        value: JSON.stringify(value),
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: settings.key,
        set: {
          value: JSON.stringify(value),
          updatedAt: now,
        },
      })

    this.settings[key] = value

    this.log.info(`Setting updated: ${key} = ${value}`)
  }
}
