import {
  type App,
  type Comment,
  type CommentUser,
  type LoggedInUser,
  PostCommentResponse,
  SocketEvent,
  SocketEventTypeEnum,
  SocketNewCommentEvent,
  Sort,
} from "@chatfall/server"
import { treaty } from "@elysiajs/eden"
import { produce } from "immer"
import { create } from "zustand"
import { jwt } from "../lib/jwt"

type State = {
  canonicalUrl: string | null
  sort: Sort
  users: Record<number, CommentUser>
  numNewComments: number
  totalComments: number
  currentPage: number
  totalPages: number
  comments: Comment[]
  liked: Record<number, boolean>
  loggedInUser?: LoggedInUser
}

type Actions = {
  getCanonicalUrl: () => string
  logout: () => void
  checkAuth: () => Promise<void>
  addComment: (comment: string) => Promise<PostCommentResponse>
  likeComment: (commentId: number, like: boolean) => Promise<void>
  fetchComments: (sort?: Sort) => Promise<void>
  loginEmail: (email: string) => Promise<{ blob: string }>
  verifyEmail: (blob: string, code: string) => Promise<void>
}

export type CommentStoreProps = {
  server: string
}

const createApp = (server: string) =>
  treaty<App>(server, {
    headers: () => {
      const jwtToken = jwt.getToken()
      if (jwtToken?.token) {
        return {
          authorization: `Bearer ${jwtToken.token}`,
        }
      }
    },
  })

type TreatyApp = ReturnType<typeof createApp>
type TreatyAppWebsocket = ReturnType<TreatyApp["ws"]["subscribe"]>

class Socket {
  private ws: TreatyAppWebsocket
  private onReady: Promise<void>

  constructor(app: TreatyApp) {
    this.ws = app.ws.subscribe()

    this.onReady = new Promise<void>((resolve) =>
      this.ws.on("open", () => resolve()),
    )

    this.ws
      .on("error", (error) => {
        console.error("Websocket error", error)
      })
      .on("close", () => {
        console.debug("Websocket closed")
      })
  }

  async onceReady(cb: (ws: TreatyAppWebsocket) => void) {
    return this.onReady.then(() => cb(this.ws))
  }

  onMessage(cb: (data: SocketEvent) => void) {
    this.ws.subscribe((data) => {
      cb(data.data)
    })
  }
}

const getPageUrl = () => {
  return window.location.href
}

export const createStore = (props: CommentStoreProps) => {
  const app = createApp(props.server)

  // websocket
  const ws = new Socket(app)

  const _updateLoginState = (
    set: (
      fn: (state: State) => (State & Actions) | Partial<State & Actions>,
    ) => void,
    loggedInUser?: LoggedInUser,
  ) => {
    set(
      produce((state) => {
        state.loggedInUser = loggedInUser
        ws.onceReady((ws) => {
          const token = jwt.getToken()?.token
          ws.send({ type: "register", url: getPageUrl(), jwtToken: token })
        })
      }),
    )
  }

  const useStore = create<State & Actions>()((set, get) => ({
    canonicalUrl: null,
    sort: Sort.newest_first,
    users: {},
    numNewComments: 0,
    totalComments: 0,
    currentPage: 0,
    totalPages: 0,
    comments: [],
    liked: {},
    loggedInUser: undefined,
    getCanonicalUrl: () => {
      return get().canonicalUrl || getPageUrl()
    },
    logout: () => {
      jwt.removeToken()
      _updateLoginState(set)
    },
    checkAuth: async () => {
      if (jwt.getToken()) {
        const { data, error } = await app.api.users.check.get()
        if (error) {
          console.error(`Error checking auth`, error)
          jwt.removeToken()
        } else {
          if (!data.user) {
            console.warn(`Unable to verify JWT token, removing it`)
            jwt.removeToken()
          } else {
            _updateLoginState(set, data.user as LoggedInUser)
            return
          }
        }
      }

      _updateLoginState(set)
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

      _updateLoginState(set, data.user)
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
      const { data, error } = await app.api.comments.index.post({
        comment,
        url: get().getCanonicalUrl(),
      })

      if (error) {
        throw error
      }

      return data
    },
    fetchComments: async (sort = get().sort) => {
      // if we've changed the filter then reset the paging, otherwise increment
      const page = sort === get().sort ? get().currentPage + 1 : 1

      const { data, error } = await app.api.comments.index.get({
        query: {
          url: get().getCanonicalUrl(),
          page: `${page}`,
          sort,
        },
      })

      if (error) {
        throw error
      }

      set(
        produce((state) => {
          state.totalComments = data.totalComments
          // if fetching more comments, append to existing list
          if (page > 1) {
            Object.assign(state.users, data.users)
            Object.assign(state.liked, data.liked)
            state.comments = state.comments.concat(data.comments)
          }
          // if fetching new comments, reset the list
          else {
            state.users = data.users
            state.comments = data.comments
            state.liked = data.liked
          }
          state.canonicalUrl = data.canonicalUrl
          state.totalPages = data.totalPages
          state.sort = sort
          state.currentPage = page
          if (state.currentPage === 1) {
            state.numNewComments = 0 // reset new comments counter if on page 1 of filter
          }
        }),
      )
    },
  }))

  ws.onMessage((data) => {
    console.debug(`Received socket event`, data)

    switch (data.type) {
      case SocketEventTypeEnum.NewComment:
        // show immediately if it's the current user
        if (data.user.id === useStore.getState().loggedInUser?.id) {
          useStore.setState(
            produce((state) => {
              const newComment = data.data as SocketNewCommentEvent

              const existing = (state.comments as Comment[]).find(
                (c) => c.id === newComment.id,
              )

              if (!existing) {
                state.comments.unshift({
                  ...(data.data as SocketNewCommentEvent),
                } as Comment)
                state.users[data.user.id] = data.user
              }
            }),
          )
        } else {
          useStore.setState(
            produce((state) => {
              state.numNewComments++
            }),
          )
        }
        break
      case SocketEventTypeEnum.LikeComment:
        useStore.setState(
          produce((state) => {
            if (data.user.id === state.loggedInUser?.id) {
              state.liked[data.data.id] = true
            }
            state.comments = state.comments.map((comment: Comment) => {
              if (comment.id === data.data.id) {
                comment.rating = data.data.rating
              }
              return comment
            })
          }),
        )
        break
      case SocketEventTypeEnum.UnlikeComment:
        useStore.setState(
          produce((state) => {
            if (data.user.id === state.loggedInUser?.id) {
              state.liked[data.data.id] = false
            }
            state.comments = state.comments.map((comment: Comment) => {
              if (comment.id === data.data.id) {
                comment.rating = data.data.rating
              }
              return comment
            })
          }),
        )
        break
    }
  })

  return { useStore }
}

export type CommentStore = ReturnType<typeof createStore>
