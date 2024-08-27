import { type Static, t } from "elysia"

export enum SocketEventTypeEnum {
  NewComment = "NewComment",
  LikeComment = "LikeComment",
  UnlikeComment = "UnlikeComment",
  NewReply = "NewReply",
}

export const SocketCommentUser = t.Object({
  id: t.Number(),
  name: t.String(),
})

export const SocketNewCommentEvent = t.Object({
  id: t.Number(),
  body: t.String(),
  depth: t.Number(),
  path: t.String(),
  rating: t.Number(),
  reply_count: t.Number(),
  updatedAt: t.String(),
  userId: t.Number(),
  postId: t.Number(),
  createdAt: t.String(),
})

export type SocketNewCommentEvent = Static<typeof SocketNewCommentEvent>

export const SocketLikeCommentEvent = t.Object({
  id: t.Number(),
  rating: t.Number(),
})

export type SocketLikeCommentEvent = Static<typeof SocketLikeCommentEvent>

export const SocketEvent = t.Object({
  type: t.Enum(SocketEventTypeEnum),
  user: SocketCommentUser,
  data: t.Union([SocketNewCommentEvent, SocketLikeCommentEvent]),
})

export type SocketEvent = Static<typeof SocketEvent>
