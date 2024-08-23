import { and, asc, count, desc, eq, sql } from "drizzle-orm"
import Elysia, { t } from "elysia"

import {
  type Comment,
  type Post,
  commentRatings,
  comments,
  posts,
  users,
} from "../db/schema"
import { type CommentUser, type GlobalContext, Sort } from "../types"
import { dateNow } from "../utils/date"
import { execHandler, getUserId } from "./utils"

export const createCommentRoutes = (ctx: GlobalContext) => {
  const { db } = ctx

  return new Elysia({ prefix: "/comments" })
    .post(
      "/like",
      async ({ body, ...props }) => {
        return await execHandler(async () => {
          const { commentId, like } = body
          const userId = getUserId(props)!

          await db.transaction(async (tx) => {
            const [existing] = await db
              .select()
              .from(commentRatings)
              .where(
                and(
                  eq(commentRatings.commentId, commentId),
                  eq(commentRatings.userId, userId),
                ),
              )

            if (existing) {
              if (like) {
                await db
                  .update(commentRatings)
                  .set({
                    rating: 1,
                    updatedAt: dateNow(),
                  })
                  .where(eq(commentRatings.id, existing.id))

                await db
                  .update(comments)
                  .set({
                    rating: sql`${comments.rating} + 1`,
                  })
                  .where(eq(comments.id, commentId))
              } else {
                await db
                  .delete(commentRatings)
                  .where(eq(commentRatings.id, existing.id))

                await db
                  .update(comments)
                  .set({
                    rating: sql`${comments.rating} - 1`,
                  })
                  .where(eq(comments.id, commentId))
              }
            } else {
              await db.insert(commentRatings).values({
                userId,
                commentId,
                rating: 1,
                createdAt: dateNow(),
                updatedAt: dateNow(),
              })

              await db
                .update(comments)
                .set({
                  rating: sql`${comments.rating} + 1`,
                })
                .where(eq(comments.id, commentId))
            }
          })
        })
      },
      {
        body: t.Object({
          commentId: t.Number(),
          like: t.Boolean(),
        }),
      },
    )
    .post(
      "/",
      async ({ body, ...props }) => {
        return await execHandler(async () => {
          const { comment, postId, parentCommentId } = body
          const userId = getUserId(props)!

          let newCommentIndex = 1

          let parent: Comment | undefined

          if (parentCommentId) {
            let [parent] = await db
              .select()
              .from(comments)
              .where(
                and(
                  eq(comments.postId, postId),
                  eq(comments.id, parentCommentId),
                ),
              )

            if (!parent) {
              throw new Error("Parent comment not found")
            }

            newCommentIndex = parent.reply_count + 1
          } else {
            const cnt = await db
              .select({ count: count() })
              .from(comments)
              .where(and(eq(comments.postId, postId), eq(comments.depth, 0)))

            newCommentIndex = cnt[0].count + 1
          }

          const [inserted] = await db
            .insert(comments)
            .values({
              userId,
              postId: postId,
              body: comment,
              depth: parent ? parent.depth + 1 : 0,
              path: parent
                ? `${parent.path}.${newCommentIndex}`
                : `${newCommentIndex}`,
              createdAt: dateNow(),
              updatedAt: dateNow(),
            })
            .returning({
              id: comments.id,
            })

          return { id: inserted.id }
        })
      },
      {
        body: t.Object({
          comment: t.String(),
          postId: t.Number(),
          parentCommentId: t.Optional(t.Number()),
        }),
      },
    )
    .get(
      "/",
      async ({ query, ...props }) => {
        return await execHandler(async () => {
          const userId = getUserId(props)
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
            .from(posts)
            .leftJoin(comments, eq(posts.id, comments.postId))
            .leftJoin(users, eq(users.id, comments.userId))
            .leftJoin(
              commentRatings,
              and(
                eq(commentRatings.commentId, comments.id),
                eq(commentRatings.userId, userId || 0),
              ),
            )
            .where(and(eq(posts.url, url), eq(comments.depth, 0)))
            .orderBy(order_by)
            .limit(Number(limit))
            .offset((Number(page) - 1) * Number(limit))

          const ret: {
            post: Post | null
            users: Record<number, CommentUser>
            comments: Comment[]
            liked: Record<number, boolean>
          } = {
            post: null,
            users: {} as Record<number, CommentUser>,
            comments: [] as Comment[],
            liked: {} as Record<number, boolean>,
          }

          for (const c of list) {
            if (!ret.post) {
              ret.post = c.posts
            }

            if (c.users) {
              ret.users[c.users.id] = {
                id: c.users.id,
                username: c.users.name,
              }
            }

            if (c.comments) {
              ret.comments.push(c.comments)

              if (c.comment_ratings) {
                ret.liked[c.comments.id] = !!c.comment_ratings.id
              }
            }
          }

          return ret
        })
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
}
