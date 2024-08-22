import { and, asc, count, desc, eq } from "drizzle-orm"
import Elysia, { t } from "elysia"

import { type Comment, type Post, comments, posts, users } from "../db/schema"
import { type CommentUser, type GlobalContext, Sort } from "../types"
import { dateNow } from "../utils/date"
import { execHandler, getUserId } from "./utils"

export const createCommentRoutes = (ctx: GlobalContext) => {
  const { db } = ctx

  return new Elysia({ prefix: "/comments" })
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
      async ({ query }) => {
        return await execHandler(async () => {
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
            .leftJoin(comments, and(eq(posts.id, comments.postId)))
            .leftJoin(users, eq(users.id, comments.userId))
            .where(and(eq(posts.url, url), eq(comments.depth, 0)))
            .orderBy(order_by)
            .limit(Number(limit))
            .offset((Number(page) - 1) * Number(limit))

          const ret: {
            post: Post | null
            users: Record<number, CommentUser>
            comments: Comment[]
          } = {
            post: null,
            users: {} as Record<number, CommentUser>,
            comments: [] as Comment[],
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
