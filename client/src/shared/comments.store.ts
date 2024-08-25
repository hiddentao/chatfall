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
  liked: Record<number, boolean>
  loggedIn: boolean
}

type Actions = {
  checkAuth: () => Promise<void>
  addComment: (comment: string) => Promise<void>
  likeComment: (commentId: number, like: boolean) => Promise<void>
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

  // websocket
  const ws = app.ws.subscribe()
  const onceWebsocketReady = new Promise<void>((resolve) =>
    ws.on("open", () => resolve()),
  )
  ws.on("error", (error) => {
    console.error("Websocket error", error)
  })
    .on("close", () => {
      console.log("Websocket closed")
    })
    .subscribe((data) => {
      console.log("Websocket data", data)
    })

  const _updateLoginState = (
    set: (
      fn: (state: State) => (State & Actions) | Partial<State & Actions>,
    ) => void,
    loggedIn: boolean,
  ) => {
    set(
      produce((state) => {
        state.loggedIn = loggedIn
        onceWebsocketReady.then(() => {
          const token = jwt.getToken()?.token
          ws.send({ type: "register", jwtToken: token })
        })
      }),
    )
  }

  const useStore = create<State & Actions>()((set, get) => ({
    sort: Sort.newest_first,
    post: null,
    users: {},
    comments: [],
    liked: {},
    loggedIn: false,
    checkAuth: async () => {
      if (jwt.getToken()) {
        const { data, error } = await app.api.users.check.get()
        if (error) {
          console.error(`Error checking auth`, error)
          jwt.removeToken()
        } else {
          if (!data.id) {
            console.warn(`Unable to verify JWT token, removing it`)
            jwt.removeToken()
          } else {
            _updateLoginState(set, true)
            return
          }
        }
      }

      _updateLoginState(set, false)
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

      _updateLoginState(set, true)
    },
    loginEmail: async (email: string) => {
      const { data, error } = await app.api.users.login_email.post({ email })

      if (error) {
        throw error
      }

      return data
    },
    likeComment: async (commentId: number, like: boolean) => {
      const { error } = await app.api.comments.like.post({
        commentId,
        like,
      })

      if (error) {
        throw error
      }
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
          state.liked = data.liked
        }),
      )
    },
  }))

  return { useStore }
}

export type CommentStore = ReturnType<typeof createStore>
