import { type Static, t } from "elysia"

export enum SocketEventTypeEnum {
  NewComment = "NewComment",
  LikeComment = "LikeComment",
  UnlikeComment = "UnlikeComment",
  NewReply = "NewReply",
}

export const SocketCommentUser = t.Object({
  id: t.Number(),
  username: t.String(),
})

export const SocketNewCommentEvent = t.Object({
  id: t.Number(),
  body: t.String(),
  depth: t.Number(),
  path: t.String(),
  createdAt: t.String(),
})

export const SocketEvent = t.Object({
  type: t.Enum(SocketEventTypeEnum),
  user: SocketCommentUser,
  data: t.Union([SocketNewCommentEvent]),
})
