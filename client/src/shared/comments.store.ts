import {
  type App,
  type Comment,
  CommentUser,
  type Post,
  Sort,
} from "@chatfall/server"
import { treaty } from "@elysiajs/eden"
import { produce } from "immer"
import { create } from "zustand"

type State = {
  sort: Sort
  post: Post | null
  users: Record<number, CommentUser>
  comments: Comment[]
}

type Actions = {
  addComment: (comment: string) => Promise<void>
  fetchComments: (sort?: Sort) => Promise<void>
}

export type CommentStoreProps = {
  server: string
}

export const createStore = (props: CommentStoreProps) => {
  const app = treaty<App>(props.server)

  const useStore = create<State & Actions>()((set, get) => ({
    sort: Sort.newest_first,
    post: null,
    users: {},
    comments: [],
    addComment: async (comment: string) => {
      const { error } = await app.api.comments.index.post({
        comment,
        postId: get().post!.id,
      })

      if (error) {
        throw error
      }
    },
    fetchComments: async (sort = get().sort) => {
      const { data, error } = await app.api.comments.index.get({
        query: {
          url: "test",
          page: "1",
          limit: "10",
          sort,
        },
      })

      if (error) {
        throw error
      }

      set(
        produce((state) => {
          state.sort = sort
          state.post = data.post
          state.users = data.users
          state.comments = data.comments
        }),
      )
    },
  }))

  return { useStore }
}

export type CommentStore = ReturnType<typeof createStore>
