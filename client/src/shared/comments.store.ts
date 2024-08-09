import { type App, type Comment, CommentUser, Sort } from "@chatfall/server"
import { treaty } from "@elysiajs/eden"
import { produce } from "immer"
import { create } from "zustand"

type State = {
  sort: Sort
  users: Record<number, CommentUser>
  comments: Comment[]
}

type Actions = {
  fetchComments: (sort?: Sort) => Promise<void>
}

export type CommentStoreProps = {
  server: string
}

export const createStore = (props: CommentStoreProps) => {
  const app = treaty<App>(props.server)

  const useStore = create<State & Actions>()((set, get) => ({
    sort: Sort.newest_first,
    users: {},
    comments: [],
    fetchComments: async (sort = get().sort) => {
      await new Promise((resolve) => setTimeout(resolve, 2000))

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
          state.users = data.users
          state.comments = data.comments
        }),
      )
    },
  }))

  return { useStore }
}

export type CommentStore = ReturnType<typeof createStore>
