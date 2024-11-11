export enum Setting {
  ModerateAllComments = "moderateAllComments",
  CommentsPerPage = "commentsPerPage",
  UserNextCommentDelaySeconds = "userNextCommentDelaySeconds",
  SpamPhrases = "spamPhrases",
  BlacklistedEmails = "blacklistedEmails",
  BlacklistedDomains = "blacklistedDomains",
}

// Define a mapped type for setting values
export type Settings = {
  [Setting.CommentsPerPage]: number
  [Setting.UserNextCommentDelaySeconds]: number
  [Setting.SpamPhrases]: string[]
  [Setting.BlacklistedEmails]: string[]
  [Setting.BlacklistedDomains]: string[]
  [Setting.ModerateAllComments]: boolean
}

// Create a type that maps the enum to its corresponding value type
export type SettingValue<T extends Setting> = Settings[T]

export type SettingValueRaw = boolean | number | string | string[]
