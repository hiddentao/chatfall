import { and, count, desc, eq, sql } from "drizzle-orm"
import Elysia, { t } from "elysia"
import {
  type Comment,
  CommentStatus,
  commentRatings,
  comments,
  posts,
} from "../db/schema"
import { Setting } from "../settings/types"
import { type GlobalContext } from "../types"
import { dateDiff, dateFormatDiff, dateNow } from "../utils/date"
import { generateCanonicalUrl } from "../utils/string"
import { SocketEventTypeEnum } from "../ws/types"
import {
  AdminCommentQuerySchema,
  AdminCommentResponseSchema,
  CommentQuerySchema,
  CommentResponseSchema,
  execHandler,
  fetchComments,
  getLoggedInUser,
  getLoggedInUserAndAssert,
  getLoggedInUserAndAssertAdmin,
} from "./utils"

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

          // check that comment doesn't contain blacklisted words
          const blacklistedWords = ctx.settings.getSetting(
            Setting.BlacklistedWords,
          )
          const commentToCheck = comment.toLowerCase()
          if (blacklistedWords?.length) {
            for (const word of blacklistedWords) {
              if (commentToCheck.includes(word)) {
                throw new Error(`Blacklisted word detected: ${word}`)
              }
            }
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
              const minDelay =
                ctx.settings.getSetting(Setting.UserNextCommentDelaySeconds) *
                1000
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
                depth,
                path,
                createdAt,
                updatedAt: dateNow(),
                status: ctx.settings.getSetting(Setting.ModerateAllComments)
                  ? CommentStatus.Moderation
                  : CommentStatus.Visible,
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
              ...sanitizeCommentBody(inserted),
            },
          })

          let msg: string

          if (inserted.status === CommentStatus.Moderation) {
            msg = `Your ${
              parentCommentId ? "reply" : "comment"
            } will be visible once the moderator has approved it.`
          } else {
            msg = `Your ${
              parentCommentId ? "reply" : "comment"
            } was successfully added!`
          }

          return {
            id: inserted.id,
            message: msg,
            alert: true,
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
          const limit = ctx.settings.getSetting(Setting.CommentsPerPage)

          const ret = await fetchComments(db, {
            canonicalUrl,
            depth: Number(depth),
            pathPrefix,
            skip: Number(skip),
            sort,
            limit,
            userId: user?.id,
            status: [CommentStatus.Visible, CommentStatus.Moderation],
          })

          ret.comments = ret.comments.map(sanitizeCommentBody)

          Object.entries(ret.users).forEach(([_, u]) => {
            delete u.email // don't return email to non-admin users
          })

          return ret
        })
      },
      {
        query: CommentQuerySchema,
        response: CommentResponseSchema,
      },
    )
    .get(
      "/admin/urls",
      async ({ ...props }) => {
        return await execHandler(async () => {
          await getLoggedInUserAndAssertAdmin(ctx, props)
          const urls = await db
            .selectDistinct({ url: posts.url })
            .from(posts)
            .innerJoin(comments, eq(comments.postId, posts.id))
            .orderBy(posts.url)

          return urls.map(({ url }) => url)
        })
      },
      {
        response: t.Array(t.String()),
      },
    )
    .get(
      "/admin/comments",
      async ({ query, ...props }) => {
        return await execHandler(async () => {
          await getLoggedInUserAndAssertAdmin(ctx, props)

          const {
            url: _url,
            skip,
            sort,
            depth,
            pathPrefix,
            status,
            search,
          } = query

          const canonicalUrl = generateCanonicalUrl(_url)
          const limit = ctx.settings.getSetting(Setting.CommentsPerPage)

          return fetchComments(db, {
            canonicalUrl,
            depth: Number(depth),
            pathPrefix,
            skip: Number(skip),
            sort,
            limit,
            status: status ? [status as CommentStatus] : undefined,
            search,
          })
        })
      },
      {
        query: AdminCommentQuerySchema,
        response: AdminCommentResponseSchema,
      },
    )
    .put(
      "/admin/comment_status",
      async ({ body, ...props }) => {
        return await execHandler(async () => {
          await getLoggedInUserAndAssertAdmin(ctx, props)
          const { commentId, status } = body

          await db
            .update(comments)
            .set({ status, updatedAt: dateNow() })
            .where(eq(comments.id, commentId))

          return { success: true }
        })
      },
      {
        body: t.Object({
          commentId: t.Number(),
          status: t.Enum(CommentStatus),
        }),
      },
    )
}

const sanitizeCommentBody = (comment: Comment): Comment => {
  if (comment.status === CommentStatus.Moderation) {
    comment.body = "[awaiting moderation]"
  } else if (comment.status === CommentStatus.Deleted) {
    comment.body = "[deleted]"
  }

  return comment
}
