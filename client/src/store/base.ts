import {
  type Comment,
  CommentUser,
  type LoggedInUser,
  type ServerApp,
  SocketEvent,
  Sort,
} from "@chatfall/server"
import { treaty } from "@elysiajs/eden"
import { produce } from "immer"
import { StoreApi, UseBoundStore, create } from "zustand"
import { jwt } from "../lib/jwt"

export type BaseStoreProps = {
  initialSort?: Sort
  server: string
}

const createApp = (server: string): ReturnType<typeof treaty<ServerApp>> => {
  return treaty<ServerApp>(server, {
    headers: () => {
      const jwtToken = jwt.getToken()
      if (jwtToken?.token) {
        return {
          authorization: `Bearer ${jwtToken.token}`,
        }
      }
    },
  })
}

export type TreatyApp = ReturnType<typeof createApp>

type AppWebSocket = ReturnType<TreatyApp["ws"]["subscribe"]>

export class Socket {
  private ws: AppWebSocket
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

  async onceReady(cb: (ws: AppWebSocket) => void) {
    return this.onReady.then(() => cb(this.ws))
  }

  onMessage(cb: (data: SocketEvent) => void) {
    this.ws.subscribe((data) => {
      cb(data.data)
    })
  }
}

export type StoreCommentId = number

export type StoreCommentList = {
  sort: Sort
  parentDepth: number
  parentPath: string
  items: number[]
  total: number
  otherUserNewItems: number[]
  myNewItems: number[]
}

export type StoreComment = Comment & {
  url: string
}

export type CoreState = {
  canonicalUrl: string | null
  loggedInUser?: LoggedInUser
  checkingAuth: boolean
  lastError?: string

  users: Record<StoreCommentId, CommentUser>
  liked: Record<StoreCommentId, boolean>
  comments: Record<StoreCommentId, StoreComment>
  replies: Record<StoreCommentId, StoreCommentList>
  rootList: StoreCommentList

  clearLastError: () => void
  getCanonicalUrl: () => string

  logout: () => void
  checkAuth: () => Promise<void>
  loginEmail: (email: string, adminOnly?: boolean) => Promise<{ blob: string }>
  verifyEmail: (blob: string, code: string) => Promise<void>

  fetchComments: (props: {
    url?: string
    sort?: Sort
    skipOverride?: number
  }) => Promise<void>
  fetchReplies: (props: {
    parentCommentId: number
  }) => Promise<void>
}

const getPageUrl = () => {
  return window.location.href
}

type StoreSetMethod = (fn: (state: any) => any | Partial<any>) => void

const tryCatchApiCall = async <T = any>(
  set: StoreSetMethod,
  apiCall: () => Promise<any>,
) => {
  set(
    produce((state) => {
      state.lastError = undefined
    }),
  )

  const { data, error } = await apiCall()

  if (error) {
    set(
      produce((state) => {
        if (error.message) {
          try {
            const parsedError = JSON.parse(error.message)
            state.lastError = parsedError?.message || `${parsedError}`
          } catch (_e) {
            state.lastError = `${error}`
          }
        }
      }),
    )
    throw error
  }

  return data as T
}

export type TryCatchApiCall = typeof tryCatchApiCall

export const createBaseStore = <State extends CoreState>({
  props,
  createAdditionalState,
  fetchCommentsImplementation,
  fetchRepliesImplementation,
  onSocketMessage,
}: {
  props: BaseStoreProps
  createAdditionalState: (
    set: (fn: (state: State) => State | Partial<State>) => void,
    get: () => State,
    tryCatchApiCall: TryCatchApiCall,
    app: TreatyApp,
  ) => Omit<State, keyof CoreState>
  fetchCommentsImplementation: (props: {
    app: TreatyApp
    get: () => State
    url: string
    sort: Sort
    skip: number
  }) => ReturnType<TreatyApp["api"]["comments"]["index"]["get"]>
  fetchRepliesImplementation: (props: {
    app: TreatyApp
    get: () => State
    url: string
    parentDepth: number
    parentPath: string
    skip: number
  }) => ReturnType<TreatyApp["api"]["comments"]["index"]["get"]>
  onSocketMessage: (
    useStore: UseBoundStore<StoreApi<State>>,
    data: SocketEvent,
  ) => void
}) => {
  const app = createApp(props.server)

  const ws = new Socket(app)

  const _updateLoginState = (
    set: (fn: (state: State) => State | Partial<State>) => void,
    loggedInUser?: LoggedInUser,
  ) => {
    set(
      produce((state) => {
        state.checkingAuth = false
        state.loggedInUser = loggedInUser
        ws.onceReady((ws) => {
          const token = jwt.getToken()?.token
          ws.send({ type: "register", url: getPageUrl(), jwtToken: token })
        })
      }),
    )
  }

  const useStore = create<State>()(
    (set, get) =>
      ({
        canonicalUrl: null,
        loggedInUser: undefined,
        checkingAuth: true,
        lastError: undefined,

        users: {},
        liked: {},
        comments: {},
        replies: {},
        rootList: createCommentList(-1, "", props.initialSort),

        clearLastError: () => {
          set(
            produce((state) => {
              state.lastError = undefined
            }),
          )
        },
        getCanonicalUrl: () => {
          return get().canonicalUrl || getPageUrl()
        },
        logout: () => {
          jwt.removeToken()
          _updateLoginState(set)
        },
        checkAuth: async () => {
          set(
            produce((state) => {
              state.checkingAuth = true
            }),
          )

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
          const data = await tryCatchApiCall(set, () =>
            app.api.users.verify_email.post({
              blob,
              code,
            }),
          )

          jwt.setToken({ token: data.jwt })

          _updateLoginState(set, data.user)
        },
        loginEmail: async (email: string, adminOnly?: boolean) => {
          const data = await tryCatchApiCall(set, () =>
            app.api.users.login_email.post({
              email,
              adminOnly,
            }),
          )

          return data
        },
        fetchComments: async ({
          url = get().getCanonicalUrl(),
          sort = get().rootList.sort,
          skipOverride,
        }) => {
          const skip =
            typeof skipOverride === "number"
              ? skipOverride
              : get().rootList.items.length

          const data = await tryCatchApiCall(set, () =>
            fetchCommentsImplementation({ app, get, url, sort, skip }),
          )

          set(
            produce((state) => {
              state.canonicalUrl = data.canonicalUrl

              if (skip) {
                Object.assign(state.users, data.users)
                Object.assign(state.liked, data.liked)
                Object.assign(
                  state.comments,
                  commentListToMap(data.comments, url),
                )
                appendCommentList(state.rootList, data)
              } else {
                state.users = data.users
                state.liked = data.liked
                state.comments = commentListToMap(data.comments, url)
                state.replies = {}
                replaceCommentList(state.rootList, data)
                state.rootList.sort = sort
              }
            }),
          )
        },
        fetchReplies: async ({ parentCommentId }) => {
          const existing = get().replies[parentCommentId]

          const parentDepth = existing
            ? existing.parentDepth
            : get().comments[parentCommentId].depth

          const parentPath = existing
            ? existing.parentPath
            : get().comments[parentCommentId].path

          const skip = existing ? existing.items.length : 0

          const url = get().comments[parentCommentId].url

          const data = await tryCatchApiCall(set, () =>
            fetchRepliesImplementation({
              app,
              get,
              url,
              parentDepth,
              parentPath,
              skip,
            }),
          )

          set(
            produce((state) => {
              Object.assign(state.users, data.users)
              Object.assign(state.liked, data.liked)
              Object.assign(
                state.comments,
                commentListToMap(data.comments, url),
              )

              if (skip) {
                appendCommentList(state.replies[parentCommentId], data)
              } else {
                state.replies[parentCommentId] = createCommentList(
                  parentDepth,
                  parentPath,
                )
                replaceCommentList(state.replies[parentCommentId], data)
              }
            }),
          )
        },
        ...createAdditionalState(set, get, tryCatchApiCall, app),
      }) as State,
  )

  ws.onMessage((data) => {
    onSocketMessage(useStore, data)
  })

  return { useStore }
}

export type BaseStore = ReturnType<typeof createBaseStore>

const createCommentList = (
  parentDepth: number,
  parentPath: string,
  sort: Sort = Sort.newestFirst,
) => {
  return {
    sort,
    parentDepth,
    parentPath,
    items: [],
    total: 0,
    otherUserNewItems: [],
    myNewItems: [],
  } as StoreCommentList
}

const commentListToMap = (comments: Comment[], url: string) => {
  return comments.reduce(
    (acc, c) => {
      acc[c.id] = { ...c, url }
      return acc
    },
    {} as Record<StoreCommentId, StoreComment>,
  )
}

const replaceCommentList = (
  list: StoreCommentList,
  data: {
    comments: Comment[]
    totalComments: number
  },
) => {
  const { comments, totalComments } = data
  list.items = comments.map((c) => c.id)
  list.total = totalComments
  list.otherUserNewItems = []
  list.myNewItems = []
}

const appendCommentList = (
  list: StoreCommentList,
  data: {
    comments: Comment[]
    totalComments: number
  },
) => {
  const { comments, totalComments } = data
  const newItems = comments
    .filter((c) => !list.items.includes(c.id))
    .map((c) => c.id)
  list.items = list.items.concat(newItems)
  list.total = totalComments
  list.otherUserNewItems = list.otherUserNewItems.filter(
    (c: number) => !list.items.includes(c),
  )
  list.myNewItems = list.myNewItems.filter(
    (c: number) => !list.items.includes(c),
  )
}
