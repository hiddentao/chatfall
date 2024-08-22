import type { app } from "./app"

export type App = typeof app

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

export type {
  UserToInsert,
  User,
  PostToInsert,
  Post,
  CommentToInsert,
  Comment,
  CommentRatingToInsert,
  CommentRating,
} from "./db/schema"

export * from "./utils/date"
