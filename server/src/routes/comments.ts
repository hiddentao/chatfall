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
import { Setting } from "../settings"
import { type CommentUser, type GlobalContext, Sort } from "../types"
import { dateDiff, dateFormatDiff, dateNow } from "../utils/date"
import { SocketEventTypeEnum } from "../ws/types"
import { execHandler, getLoggedInUser, getLoggedInUserAndAssert } from "./utils"

export const createCommentRoutes = (ctx: GlobalContext) => {
  const { db } = ctx

  return new Elysia({ prefix: "/comments" })
    .post(
      "/like",
      async ({ body, ...props }) => {
        return await execHandler(async () => {
          const { commentId, like } = body
          const user = getLoggedInUserAndAssert(props)

          const rating = await db.transaction(async (tx) => {
            const [existing] = await tx
              .select()
              .from(commentRatings)
              .where(
                and(
                  eq(commentRatings.commentId, commentId),
                  eq(commentRatings.userId, user.id),
                ),
              )

            if (existing) {
              if (like) {
                await tx
                  .update(commentRatings)
                  .set({
                    rating: 1,
                    updatedAt: dateNow(),
                  })
                  .where(eq(commentRatings.id, existing.id))

                await tx
                  .update(comments)
                  .set({
                    rating: sql`${comments.rating} + 1`,
                  })
                  .where(eq(comments.id, commentId))
              } else {
                await tx
                  .delete(commentRatings)
                  .where(eq(commentRatings.id, existing.id))

                await tx
                  .update(comments)
                  .set({
                    rating: sql`${comments.rating} - 1`,
                  })
                  .where(eq(comments.id, commentId))
              }
            } else {
              await tx.insert(commentRatings).values({
                userId: user.id,
                commentId,
                rating: 1,
                createdAt: dateNow(),
                updatedAt: dateNow(),
              })

              await tx
                .update(comments)
                .set({
                  rating: sql`${comments.rating} + 1`,
                })
                .where(eq(comments.id, commentId))
            }

            const [{ rating }] = await tx
              .select({ rating: comments.rating })
              .from(comments)
              .where(eq(comments.id, commentId))

            return rating
          })

          ctx.sockets.broadcast({
            type: SocketEventTypeEnum.LikeComment,
            user: {
              id: user.id,
              name: user.name,
            },
            data: {
              id: commentId,
              rating,
            },
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
          const user = getLoggedInUserAndAssert(props)

          if (!user) {
            throw new Error("User not logged in")
          }

          // check the last time the user commented and make sure that enough time has elapsed
          const lastComment = await db
            .select()
            .from(comments)
            .where(
              and(eq(comments.userId, user.id), eq(comments.postId, postId)),
            )
            .orderBy(desc(comments.createdAt))
            .limit(1)

          if (lastComment.length > 0) {
            const lastCommentTime = new Date(lastComment[0].createdAt).getTime()
            const now = new Date().getTime()
            if (
              dateDiff(lastCommentTime, now) <
              ctx.settings.getSetting(Setting.UserNextCommentDelayMs)
            ) {
              throw new Error(
                `You must wait ${dateFormatDiff(lastCommentTime, now)} before commenting again!`,
              )
            }
          }

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

          const depth = parent ? parent.depth + 1 : 0
          const path = parent
            ? `${parent.path}.${newCommentIndex}`
            : `${newCommentIndex}`
          const createdAt = dateNow()

          const [inserted] = await db
            .insert(comments)
            .values({
              userId: user.id,
              postId: postId,
              body: comment,
              status: "shown",
              depth,
              path,
              createdAt,
              updatedAt: dateNow(),
            })
            .returning()

          ctx.sockets.broadcast({
            type: SocketEventTypeEnum.NewComment,
            user: {
              id: user.id,
              name: user.name,
            },
            data: {
              ...inserted,
            },
          })

          return {
            id: inserted.id,
            message: "Your comment was successfully added!",
          }
        })
      },
      {
        body: t.Object({
          comment: t.String(),
          postId: t.Number(),
          parentCommentId: t.Optional(t.Number()),
        }),
        response: t.Object({
          id: t.Number(),
          message: t.String(),
        }),
      },
    )
    .get(
      "/",
      async ({ query, ...props }) => {
        return await execHandler(async () => {
          const user = getLoggedInUser(props)
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
                eq(commentRatings.userId, user?.id || 0),
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
                name: c.users.name,
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
