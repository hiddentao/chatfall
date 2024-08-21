export const ONE_SECOND = 1000
export const ONE_MINUTE = 60 * ONE_SECOND
export const ONE_HOUR = 60 * ONE_MINUTE
export const ONE_DAY = 24 * ONE_HOUR
export const ONE_WEEK = 7 * ONE_DAY
export const ONE_MONTH = Math.floor((52 * ONE_WEEK) / 12)
export const ONE_YEAR = 365 * ONE_DAY

export type RawDate = Date | string | number

const diff = (from: RawDate, to: RawDate): number => {
  return new Date(to).getTime() - new Date(from).getTime()
}

const diffDays = (from: RawDate, to: RawDate): number => {
  return Math.floor(diff(from, to) / ONE_DAY)
}

const formatDiff = (from: RawDate, to: RawDate): string => {
  const ms = diff(from, to)

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

  return `${val} ${suffix}${val > 1 ? "s" : ""} ago`
}

export const formatCommentTime = (date: RawDate): string => {
  if (diffDays(date, new Date()) > 7) {
    const d = new Date(date)
    return `${d.getDay()} ${d.toLocaleString("default", { month: "short" })} ${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`
  } else {
    return formatDiff(date, new Date())
  }
}
