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
export type Settings = {
  [Setting.CommentsPerPage]: number
  [Setting.UserNextCommentDelayMs]: number
  [Setting.BlacklistedWords]: string[]
  [Setting.BlacklistedEmails]: string[]
  [Setting.BlacklistedDomains]: string[]
  [Setting.FlaggedWords]: string[]
  [Setting.ModerateAllComments]: boolean
}

// Create a type that maps the enum to its corresponding value type
export type SettingValue<T extends Setting> = Settings[T]

export type SettingValueRaw = boolean | number | string | string[]
