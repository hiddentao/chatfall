import { and, asc, desc, eq } from "drizzle-orm"
import Elysia, { t } from "elysia"

import { db } from "../db"
import { comments, posts, users } from "../db/schema"
import { type CommentUser, Sort } from "../types"

export const commentsRoutes = new Elysia({ prefix: "/comments" }).get(
  "/",
  async ({ query }) => {
    const { url, page, limit, sort } = query

    const order_by = {
      [Sort.newest_first]: desc(comments.createdAt),
      [Sort.oldest_first]: asc(comments.createdAt),
      [Sort.highest_score]: desc(comments.rating),
      [Sort.lowest_score]: asc(comments.rating),
      [Sort.most_replies]: desc(comments.reply_count),
      [Sort.least_replies]: asc(comments.reply_count),
    }[sort]

    const list = await db
      .select()
      .from(comments)
      .innerJoin(posts, and(eq(posts.id, comments.postId), eq(posts.url, url)))
      .innerJoin(users, eq(users.id, comments.userId))
      .where(and(eq(posts.url, url), eq(comments.depth, 0)))
      .orderBy(order_by)
      .limit(Number(limit))
      .offset((Number(page) - 1) * Number(limit))

    const ret = {
      users: {} as Record<number, CommentUser>,
      comments: list.map((c) => c.comments),
    }

    for (const c of list) {
      ret.users[c.users.id] = {
        id: c.users.id,
        username: c.users.name,
      }
    }

    return ret
  },
  {
    query: t.Object({
      url: t.String(),
      page: t.String(),
      limit: t.String(),
      sort: t.Enum(Sort),
    }),
  },
)
