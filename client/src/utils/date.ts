import { differenceInDays, format, formatDistanceToNowStrict } from "date-fns"

export const formatCommentTime = (date: string | Date): string => {
  if (differenceInDays(new Date(), new Date(date)) > 7) {
    return format(new Date(date), "d MMM yyyy HH:mm")
  } else {
    return formatDistanceToNowStrict(new Date(date), { addSuffix: true })
  }
}
