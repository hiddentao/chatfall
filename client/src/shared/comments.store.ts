import { type App, type Comment, CommentUser, Sort } from "@chatfall/server"
import { treaty } from "@elysiajs/eden"
import { produce } from "immer"
import { create } from "zustand"

const app = treaty<App>(window.location.origin, {})

type State = {
  sort: Sort
  users: Record<number, CommentUser>
  comments: Comment[]
}

type Actions = {
  fetchComments: (sort?: Sort) => Promise<void>
}

export const useCommentsStore = create<State & Actions>()((set, get) => ({
  sort: Sort.newest_first,
  users: {},
  comments: [],
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
        state.users = data.users
        state.comments = data.comments
      }),
    )
  },
}))
