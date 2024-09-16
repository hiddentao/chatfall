import { and, asc, count, desc, eq, like, sql } from "drizzle-orm"
import Elysia, { t } from "elysia"
import {
  type Comment,
  commentRatings,
  commentStatusEnum,
  comments,
  posts,
  users,
} from "../db/schema"
import { Setting } from "../settings/types"
import { type CommentUser, type GlobalContext, Sort } from "../types"
import { dateDiff, dateFormatDiff, dateNow } from "../utils/date"
import { generateCanonicalUrl } from "../utils/string"
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

          const { rating, url, isLike } = await db.transaction(async (tx) => {
            let isLike = true

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

                isLike = false
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

            const [{ url, rating }] = await tx
              .select({
                url: posts.url,
                rating: comments.rating,
              })
              .from(comments)
              .innerJoin(posts, eq(posts.id, comments.postId))
              .where(eq(comments.id, commentId))

            return { url, rating, isLike }
          })

          ctx.sockets.broadcast(url, {
            type: isLike
              ? SocketEventTypeEnum.LikeComment
              : SocketEventTypeEnum.UnlikeComment,
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
          const { comment, url: _url, parentCommentId } = body
          const user = getLoggedInUserAndAssert(props)

          const canonicalUrl = generateCanonicalUrl(_url)

          if (!user) {
            throw new Error("User not logged in")
          }

          const inserted = await db.transaction(async (tx) => {
            // check if post exists
            let postId: number

            const [post] = await tx
              .select({
                id: posts.id,
              })
              .from(posts)
              .where(eq(posts.url, canonicalUrl))
              .limit(1)

            if (!post) {
              // insert post
              const [{ id }] = await tx
                .insert(posts)
                .values({
                  url: canonicalUrl,
                  createdAt: dateNow(),
                  updatedAt: dateNow(),
                })
                .returning({
                  id: posts.id,
                })

              postId = id
            } else {
              postId = post.id
            }

            // check the last time the user commented and make sure that enough time has elapsed
            const [latestComment] = await tx
              .select({
                createdAt: comments.createdAt,
              })
              .from(comments)
              .where(
                and(eq(comments.userId, user.id), eq(comments.postId, postId)),
              )
              .orderBy(desc(comments.createdAt))
              .limit(1)

            if (latestComment) {
              const latestCommentTime = new Date(
                latestComment.createdAt,
              ).getTime()
              const now = new Date(dateNow()).getTime()
              const minDelay = ctx.settings.getSetting(
                Setting.UserNextCommentDelayMs,
              )
              if (dateDiff(latestCommentTime, now) < minDelay) {
                throw new Error(
                  `You must wait ${dateFormatDiff(now, latestCommentTime + minDelay)} before commenting again!`,
                )
              }
            }

            let newCommentIndex = 1

            let parent: Comment | undefined

            if (parentCommentId) {
              ;[parent] = await tx
                .select()
                .from(comments)
                .where(
                  and(
                    eq(comments.postId, postId),
                    eq(comments.id, Number(parentCommentId)),
                  ),
                )
                .limit(1)

              if (!parent) {
                throw new Error("Parent comment not found")
              }

              newCommentIndex = parent.replyCount + 1

              // update parent reply count
              await tx
                .update(comments)
                .set({
                  replyCount: sql`${comments.replyCount} + 1`,
                })
                .where(eq(comments.id, parent.id))
            } else {
              const cnt = await tx
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

            const [inserted] = await tx
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

            return inserted
          })

          ctx.sockets.broadcast(canonicalUrl, {
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
            message: parentCommentId
              ? "Your reply was successfully added!"
              : "Your comment was successfully added!",
            alert: false,
          }
        })
      },
      {
        body: t.Object({
          comment: t.String(),
          url: t.String(),
          parentCommentId: t.Optional(t.String()),
        }),
        response: t.Object({
          id: t.Number(),
          message: t.String(),
          alert: t.Boolean(),
        }),
      },
    )
    .get(
      "/",
      async ({ query, ...props }) => {
        return await execHandler(async () => {
          const user = getLoggedInUser(props)
          const { url: _url, skip, sort, depth, pathPrefix } = query

          const canonicalUrl = generateCanonicalUrl(_url)

          const order_by = {
            [Sort.newestFirst]: desc(comments.createdAt),
            [Sort.oldestFirst]: asc(comments.createdAt),
            [Sort.highestScore]: desc(comments.rating),
            [Sort.lowestScore]: asc(comments.rating),
            [Sort.mostReplies]: desc(comments.replyCount),
            [Sort.leastReplies]: asc(comments.replyCount),
          }[sort]

          const limit = ctx.settings.getSetting(Setting.CommentsPerPage)

          const result = await db
            .select({
              id: comments.id,
              userId: comments.userId,
              postId: comments.postId,
              body: comments.body,
              createdAt: comments.createdAt,
              updatedAt: comments.updatedAt,
              rating: comments.rating,
              depth: comments.depth,
              replyCount: comments.replyCount,
              path: comments.path,
              status: comments.status,
              users_name: users.name,
              userRatings_rating: commentRatings.rating,
              totalCount: sql<number>`count(*) over()`.as("total_count"),
            })
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
            .where(
              and(
                eq(posts.url, canonicalUrl),
                eq(comments.depth, Number(depth)),
                like(comments.path, `${pathPrefix || ""}%`),
              ),
            )
            .orderBy(order_by)
            .limit(limit)
            .offset(Number(skip))

          // Extract total count from the first row
          const totalComments = Number(result[0]?.totalCount ?? 0)

          // Remove totalCount from each row
          const list = result.map(({ totalCount, ...item }) => item)

          const ret = {
            canonicalUrl,
            totalComments,
            users: {} as Record<number, CommentUser>,
            comments: [] as Comment[],
            liked: {} as Record<number, boolean>,
          }

          for (const c of list) {
            if (c.id) {
              ret.comments.push({
                id: c.id,
                body: c.body!,
                userId: c.userId!,
                postId: c.postId!,
                createdAt: c.createdAt!,
                updatedAt: c.updatedAt!,
                rating: c.rating!,
                depth: c.depth!,
                replyCount: c.replyCount!,
                path: c.path!,
                status: c.status!,
              })

              ret.users[c.userId!] = {
                id: c.userId!,
                name: c.users_name!,
              }

              if (c.userRatings_rating) {
                ret.liked[c.id] = true
              }
            }
          }

          return ret
        })
      },
      {
        query: t.Object({
          url: t.String(),
          depth: t.String(),
          pathPrefix: t.Optional(t.String()),
          skip: t.String(),
          sort: t.Enum(Sort),
        }),
        response: t.Object({
          canonicalUrl: t.String(),
          totalComments: t.Number(),
          users: t.Record(
            t.Number(),
            t.Object({
              id: t.Number(),
              name: t.String(),
            }),
          ),
          comments: t.Array(
            t.Object({
              id: t.Number(),
              userId: t.Number(),
              postId: t.Number(),
              body: t.String(),
              status: t.Enum(commentStatusEnum),
              depth: t.Number(),
              rating: t.Number(),
              replyCount: t.Number(),
              path: t.String(),
              createdAt: t.String(),
              updatedAt: t.String(),
            }),
          ),
          liked: t.Record(t.Number(), t.Boolean()),
        }),
      },
    )
}
