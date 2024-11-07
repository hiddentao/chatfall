import type { Cron } from "cron-async"
import { and, eq, inArray, like, ne, or } from "drizzle-orm"
import { getAdminUser } from "../api/utils"
import type { Database } from "../db"
import { UserStatus, settings, users } from "../db/schema"
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
  private loaded: boolean = false
  private log: LogInterface
  private db: Database
  private settings: Record<string, SettingValueRaw> = {
    [Setting.ModerateAllComments]: false,
    [Setting.CommentsPerPage]: 10,
    [Setting.UserNextCommentDelaySeconds]: 60,
    [Setting.SpamPhrases]: [],
    [Setting.BlacklistedEmails]: [],
    [Setting.BlacklistedDomains]: [],
  }

  constructor(cfg: { db: Database; log: LogInterface; cron: Cron }) {
    this.log = cfg.log
    this.db = cfg.db
  }

  private async _reload() {
    if (this.loaded) {
      return
    }

    this.log.debug(`Loading settings`)

    const rows = await this.db.select().from(settings)

    if (settings) {
      this.settings = rows.reduce((acc, row) => {
        acc[row.key] = JSON.parse(row.value)
        return acc
      }, this.settings)
    }

    this.loaded = true
  }

  public getSetting<K extends Setting>(key: K): SettingValue<K> {
    this._reload()
    return this.settings[key] as SettingValue<K>
  }

  public getSettings(): Settings {
    this._reload()
    return { ...this.settings } as Settings
  }

  public async setSetting<K extends Setting>(key: K, value: SettingValue<K>) {
    this._reload()

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
          .set({ status: UserStatus.Blacklisted, updatedAt: dateNow() })
          .where(
            and(
              inArray(
                users.email,
                (value as SettingValue<Setting.BlacklistedEmails>).map((v) =>
                  v.toLowerCase(),
                ),
              ),
              eq(users.status, UserStatus.Active),
              ne(users.id, admin.id),
            ),
          )

        break
      }
      case Setting.BlacklistedDomains: {
        if (
          (value as SettingValue<Setting.BlacklistedDomains>).find((domain) =>
            admin.email.toLowerCase().endsWith(`@${domain.toLowerCase()}`),
          )
        ) {
          throw new Error(
            `Cannot blacklist domain of admin user: ${admin.email}`,
          )
        }

        const blacklistedDomains = (
          value as SettingValue<Setting.BlacklistedDomains>
        ).map((domain) => domain.toLowerCase())

        await this.db
          .update(users)
          .set({ status: UserStatus.Blacklisted, updatedAt: dateNow() })
          .where(
            and(
              or(
                ...blacklistedDomains.map((domain) =>
                  like(users.email, `%@${domain}`),
                ),
              ),
              eq(users.status, UserStatus.Active),
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
