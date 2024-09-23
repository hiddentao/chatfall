import {
  type Comment,
  PostCommentResponse,
  SocketEvent,
  SocketEventTypeEnum,
  SocketNewCommentEvent,
  Sort,
} from "@chatfall/server"
import { produce } from "immer"
import {} from "zustand"
import { BaseStoreProps, CoreState, createBaseStore } from "./base"

export type ClientState = CoreState & {
  addComment: (
    comment: string,
    parentCommentId?: number,
  ) => Promise<PostCommentResponse>
  likeComment: (commentId: number, like: boolean) => Promise<void>
}

export const createStore = (props: BaseStoreProps) => {
  return createBaseStore<ClientState>({
    props,
    createAdditionalState: (set, get, tryCatchApiCall, app) =>
      ({
        likeComment: async (commentId: number, like: boolean) => {
          return await tryCatchApiCall(set, () =>
            app.api.comments.like.post({
              commentId,
              like,
            }),
          )
        },
        addComment: async (comment: string, parentCommentId?: number) => {
          return await tryCatchApiCall(set, () =>
            app.api.comments.index.post({
              comment,
              parentCommentId: parentCommentId
                ? `${parentCommentId}`
                : undefined,
              url: get().getCanonicalUrl(),
            }),
          )
        },
      }) as Omit<ClientState, keyof CoreState>,
    fetchCommentsImplementation: async ({ app, url, sort, skip }) => {
      return await app.api.comments.index.get({
        query: {
          url,
          depth: `0`,
          skip: `${skip}`,
          sort,
        },
      })
    },
    fetchRepliesImplementation: async ({
      app,
      url,
      parentDepth,
      parentPath,
      skip,
    }) => {
      return await app.api.comments.index.get({
        query: {
          url,
          depth: `${parentDepth + 1}`,
          pathPrefix: `${parentPath}.`,
          skip: `${skip}`,
          sort: Sort.oldestFirst,
        },
      })
    },
    onSocketMessage: (useStore, data: SocketEvent) => {
      // console.debug(`Received socket event`, data)

      switch (data.type) {
        case SocketEventTypeEnum.NewComment:
          useStore.setState(
            produce((state) => {
              const newComment = data.data as SocketNewCommentEvent
              state.comments[newComment.id] = newComment
              state.users[data.user.id] = data.user

              // if it's a root comment
              if (newComment.depth === 0) {
                // if the comment is from the current user
                if (data.user.id === state.loggedInUser?.id) {
                  const existing = (state.rootList.myNewItems as number[]).find(
                    (c) => c === newComment.id,
                  )

                  if (!existing) {
                    state.rootList.myNewItems.unshift(newComment.id)
                  }
                } else {
                  const existing = (
                    state.rootList.otherUserNewItems as number[]
                  ).find((c) => c === newComment.id)

                  if (!existing) {
                    state.rootList.otherUserNewItems.unshift(newComment.id)
                  }
                }
                // it's a reply
              } else {
                const parentCommentPath = newComment.path.slice(
                  0,
                  newComment.path.lastIndexOf("."),
                )

                const parentComment = Object.values(state.comments).find(
                  (c) => (c as Comment).path === parentCommentPath,
                ) as Comment

                if (parentComment) {
                  parentComment.replyCount++
                  const replies = state.replies[parentComment.id]
                  if (replies) {
                    // if already got all comments then add to the list
                    if (replies.total === replies.items.length) {
                      replies.items.push(newComment.id)
                    }
                    // else if there are more comments to fetch
                    else {
                      // if the comment is from the current user then show it immediately
                      if (data.user.id === state.loggedInUser?.id) {
                        const existing = (replies.myNewItems as number[]).find(
                          (c) => c === newComment.id,
                        )
                        if (!existing) {
                          replies.myNewItems.unshift(newComment.id)
                        }
                      }
                    }
                    // increment the total reply count
                    replies.total++
                  }
                }
              }
            }),
          )
          break
        case SocketEventTypeEnum.LikeComment:
          useStore.setState(
            produce((state) => {
              if (data.user.id === state.loggedInUser?.id) {
                state.liked[data.data.id] = true
              }
              state.comments[data.data.id].rating = data.data.rating
            }),
          )
          break
        case SocketEventTypeEnum.UnlikeComment:
          useStore.setState(
            produce((state) => {
              if (data.user.id === state.loggedInUser?.id) {
                state.liked[data.data.id] = false
              }
              state.comments[data.data.id].rating = data.data.rating
            }),
          )
          break
      }
    },
  })
}

export type ClientStore = ReturnType<typeof createStore>
