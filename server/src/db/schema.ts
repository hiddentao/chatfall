import type { InferInsertModel, InferSelectModel } from "drizzle-orm"
import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"
import { createInsertSchema } from "drizzle-typebox"

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
    email: text("email").notNull().unique(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      users_createdAt_index: index("users_createdAt_index").on(table.createdAt),
    }
  },
)

export type User = InferSelectModel<typeof users>
export type UserToInsert = InferInsertModel<typeof users>
export type UserDisplay = {
  id: number
  username: string
}

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    url: text("url").notNull().unique(),
    title: text("title").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      posts_createdAt_index: index("posts_createdAt_index").on(table.createdAt),
    }
  },
)

export type Post = InferSelectModel<typeof posts>
export type PostToInsert = InferInsertModel<typeof posts>

export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    postId: integer("post_id")
      .notNull()
      .references(() => posts.id),
    body: text("body").notNull(),
    depth: integer("depth").notNull().default(0),
    path: text("path").notNull(),
    rating: integer("rating").notNull().default(0),
    reply_count: integer("reply_count").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      comments_createdAt_index: index("comments_createdAt_index").on(
        table.createdAt,
      ),
      comemnt_depth_index: index("depth_index").on(table.depth),
      comemnt_rating_index: index("rating_index").on(table.rating),
      comemnt_path_index: index("path_index").on(table.path),
    }
  },
)

export type Comment = InferSelectModel<typeof comments>
export type CommentToInsert = InferInsertModel<typeof comments>

export const commentRatings = pgTable(
  "comment_ratings",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    commentId: integer("comment_id")
      .notNull()
      .references(() => comments.id),
    rating: integer("rating").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      commentRatings_createdAt_index: index(
        "commentRatings_createdAt_index",
      ).on(table.createdAt),
    }
  },
)

export type CommentRating = InferSelectModel<typeof commentRatings>
export type CommentRatingToInsert = InferInsertModel<typeof commentRatings>
export const CommentRatingToInsertSchema = createInsertSchema(commentRatings)
