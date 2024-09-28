import { and, asc, desc, eq, ilike, inArray, like, or, sql } from "drizzle-orm"
import { t } from "elysia"
import {
  type Comment,
  UserStatus,
  commentRatings,
  comments,
  posts,
  users,
} from "../db/schema"
import { CommentStatus } from "../db/schema"
import { isProd } from "../env"
import {
  type CommentUser,
  type GlobalContext,
  type LoggedInUser,
  Sort,
} from "../types"

export const testDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const execHandler = async (fn: any, delayMs: number = 2000) => {
  if (!isProd) {
    await testDelay(delayMs)
  }

  return fn()
}

export const getAdminUser = async (db: GlobalContext["db"]) => {
  const [admin] = await db.select().from(users).orderBy(asc(users.id)).limit(1)

  if (!admin) {
    throw new Error("No admin user found")
  }

  return admin
}

export const getLoggedInUser = (props: any): LoggedInUser | undefined => {
  const { user } = props as { user: LoggedInUser }
  return user
}

export const getLoggedInUserAndAssert = (props: any): LoggedInUser => {
  const user = getLoggedInUser(props)
  if (!user) {
    throw new Error("You must be logged in")
  }
  return user
}

export const getLoggedInUserAndAssertAdmin = async (
  ctx: GlobalContext,
  props: any,
): Promise<LoggedInUser> => {
  const user = getLoggedInUser(props)
  if (!user) {
    throw new Error("You must be logged in")
  }
  //  check is admin by checking the db
  const admin = await getAdminUser(ctx.db)

  if (user.id !== admin.id) {
    throw new Error("You are not authorized to access this resource")
  }
  return user
}

// ... existing imports ...

export const fetchComments = async (
  db: GlobalContext["db"],
  {
    canonicalUrl,
    depth,
    pathPrefix,
    skip,
    sort,
    limit,
    userId,
    status,
    search,
  }: {
    canonicalUrl?: string
    depth?: number
    pathPrefix?: string
    skip: number
    sort: Sort
    limit: number
    userId?: number
    status?: CommentStatus[]
    search?: string
  },
) => {
  const order_by = {
    [Sort.newestFirst]: desc(comments.createdAt),
    [Sort.oldestFirst]: asc(comments.createdAt),
    [Sort.highestScore]: desc(comments.rating),
    [Sort.lowestScore]: asc(comments.rating),
    [Sort.mostReplies]: desc(comments.replyCount),
    [Sort.leastReplies]: asc(comments.replyCount),
  }[sort]

  let query = db
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
      users_status: users.status,
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
        eq(commentRatings.userId, userId || 0),
      ),
    )

  if (canonicalUrl) {
    // @ts-ignore
    query = query.where(eq(posts.url, canonicalUrl))
  }

  if (depth !== undefined) {
    // @ts-ignore
    query = query.where(eq(comments.depth, depth))
  }

  if (pathPrefix) {
    // @ts-ignore
    query = query.where(like(comments.path, `${pathPrefix}%`))
  }

  if (status && status.length) {
    // @ts-ignore
    query = query.where(inArray(comments.status, status))
  }

  if (search) {
    // @ts-ignore
    query = query.where(
      or(
        ilike(users.name, `%${search}%`),
        ilike(users.email, `%${search}%`),
        ilike(comments.body, `%${search}%`),
      ),
    )
  }

  const result = await query.orderBy(order_by).limit(limit).offset(skip)

  const totalComments = Number(result[0]?.totalCount ?? 0)
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
        status: c.users_status!,
      }

      if (c.userRatings_rating) {
        ret.liked[c.id] = true
      }
    }
  }

  return ret
}

export const CommentResponseSchema = t.Object({
  canonicalUrl: t.String(),
  totalComments: t.Number(),
  users: t.Record(
    t.Number(),
    t.Object({
      id: t.Number(),
      name: t.String(),
      status: t.Enum(UserStatus),
    }),
  ),
  comments: t.Array(
    t.Object({
      id: t.Number(),
      userId: t.Number(),
      postId: t.Number(),
      body: t.String(),
      status: t.Enum(CommentStatus),
      depth: t.Number(),
      rating: t.Number(),
      replyCount: t.Number(),
      path: t.String(),
      createdAt: t.String(),
      updatedAt: t.String(),
    }),
  ),
  liked: t.Record(t.Number(), t.Boolean()),
})

export const CommentQuerySchema = t.Object({
  url: t.String(),
  depth: t.String(),
  pathPrefix: t.Optional(t.String()),
  skip: t.String(),
  sort: t.Enum(Sort),
})

export const AdminCommentQuerySchema = t.Object({
  ...CommentQuerySchema.properties,
  status: t.Optional(
    t.Union([t.Enum(CommentStatus), t.Array(t.Enum(CommentStatus))]),
  ),
  search: t.Optional(t.String()),
})
