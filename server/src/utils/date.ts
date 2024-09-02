export const ONE_SECOND = 1000
export const ONE_MINUTE = 60 * ONE_SECOND
export const ONE_HOUR = 60 * ONE_MINUTE
export const ONE_DAY = 24 * ONE_HOUR
export const ONE_WEEK = 7 * ONE_DAY
export const ONE_MONTH = Math.floor((52 * ONE_WEEK) / 12)
export const ONE_YEAR = 365 * ONE_DAY

export type RawDate = Date | string | number

const pad = (n: number): string => {
  return n < 10 ? `0${n}` : n.toString()
}

const toDate = (date: RawDate): Date => {
  let f: Date
  if (typeof date === "string") {
    f = new Date(Date.parse(date as string))
  } else {
    f = new Date(date)
  }
  return f
}

export const dateDiff = (from: RawDate, to: RawDate): number => {
  return toDate(to).getTime() - toDate(from).getTime()
}

const diffDays = (from: RawDate, to: RawDate): number => {
  return Math.floor(dateDiff(from, to) / ONE_DAY)
}

export const dateFormatDiff = (from: RawDate, to: RawDate): string => {
  const ms = dateDiff(from, to)

  let val = 0
  let suffix = ""

  if (ms < ONE_MINUTE) {
    val = Math.floor(ms / ONE_SECOND)
    suffix = "second"
  } else if (ms < ONE_HOUR) {
    val = Math.floor(ms / ONE_MINUTE)
    suffix = "minute"
  } else if (ms < ONE_DAY) {
    val = Math.floor(ms / ONE_HOUR)
    suffix = "hour"
  } else if (ms < ONE_WEEK) {
    val = Math.floor(ms / ONE_DAY)
    suffix = "day"
  } else if (ms < ONE_MONTH) {
    val = Math.floor(ms / ONE_WEEK)
    suffix = "week"
  } else if (ms < ONE_YEAR) {
    val = Math.floor(ms / ONE_MONTH)
    suffix = "month"
  } else {
    val = Math.floor(ms / ONE_YEAR)
    suffix = "year"
  }

  return `${val} ${suffix}${val > 1 ? "s" : ""}`
}

export const formatCommentTime = (date: RawDate): string => {
  const now = dateNow()

  if (diffDays(date, now) > 7) {
    const d = new Date(date)
    return `${d.getDate()} ${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  } else {
    return `${dateFormatDiff(date, now)} ago`
  }
}

export const dateNow = (): string => {
  // return YYYY-MM-DD HH:MM:SS
  return new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ")
    .replace("Z", "")
}
