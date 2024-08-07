import type { app } from "./app"

export type App = typeof app

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

export * from "./types"
