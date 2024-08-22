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
import { jwt } from "../lib/jwt"

type State = {
  sort: Sort
  post: Post | null
  users: Record<number, CommentUser>
  comments: Comment[]
}

type Actions = {
  checkAuth: () => Promise<void>
  addComment: (comment: string) => Promise<void>
  fetchComments: (sort?: Sort) => Promise<void>
  loginEmail: (email: string) => Promise<{ blob: string }>
  verifyEmail: (blob: string, code: string) => Promise<void>
}

export type CommentStoreProps = {
  server: string
}

export const createStore = (props: CommentStoreProps) => {
  const app = treaty<App>(props.server, {
    headers: () => {
      const jwtToken = jwt.getToken()
      if (jwtToken?.token) {
        return {
          authorization: `Bearer ${jwtToken.token}`,
        }
      }
    },
  })

  const useStore = create<State & Actions>()((set, get) => ({
    sort: Sort.newest_first,
    post: null,
    users: {},
    comments: [],
    checkAuth: async () => {
      if (jwt.getToken()) {
        const { data, error } = await app.api.users.check.get()
        if (error) {
          console.error(`Error checking auth`, error)
          jwt.removeToken()
        } else if (!data.id) {
          console.warn(`Unable to verify JWT token, removing it`)
          jwt.removeToken()
        }
      }
    },
    verifyEmail: async (blob: string, code: string) => {
      const { data, error } = await app.api.users.verify_email.post({
        blob,
        code,
      })

      if (error) {
        throw error
      }

      jwt.setToken({ token: data.jwt })
    },
    loginEmail: async (email: string) => {
      const { data, error } = await app.api.users.login_email.post({ email })

      if (error) {
        throw error
      }

      return data
    },
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
