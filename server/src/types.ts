export enum Sort {
  newest_first = "nf",
  oldest_first = "of",
  highest_score = "hs",
  lowest_score = "ls",
  most_replies = "mr",
  least_replies = "lr",
}

export type CommentUser = {
  id: number
  username: string
}
