import { type App, type LoggedInUser, SocketEvent } from "@chatfall/server"
import { treaty } from "@elysiajs/eden"
import { produce } from "immer"
import { create } from "zustand"
import { jwt } from "../lib/jwt"

export type StoreProps = {
  server: string
}

const createApp = (server: string): ReturnType<typeof treaty<App>> => {
  return treaty<App>(server, {
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

export type CoreState = {
  canonicalUrl: string | null
  loggedInUser?: LoggedInUser
  checkingAuth: boolean

  getCanonicalUrl: () => string
  logout: () => void
  checkAuth: () => Promise<void>
  loginEmail: (email: string, adminOnly?: boolean) => Promise<{ blob: string }>
  verifyEmail: (blob: string, code: string) => Promise<void>
}

const getPageUrl = () => {
  return window.location.href
}

export const createBaseStore = <State extends CoreState>(
  props: StoreProps,
  createAdditionalState: (
    set: (fn: (state: State) => State | Partial<State>) => void,
    get: () => State,
    app: TreatyApp,
  ) => Omit<State, keyof CoreState>,
  onSocketMessage: (data: SocketEvent) => void,
) => {
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

  const useStore = create<State>(
    (set, get) =>
      ({
        loggedInUser: undefined,
        checkingAuth: true,

        getCanonicalUrl: () => {
          return get().canonicalUrl || getPageUrl()
        },

        logout: () => {
          jwt.removeToken()
          _updateLoginState
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
        loginEmail: async (email: string, adminOnly?: boolean) => {
          const { data, error } = await app.api.users.login_email.post({
            email,
            adminOnly,
          })

          if (error) {
            throw error
          }

          return data
        },

        ...createAdditionalState(set, get, app),
      }) as State,
  )

  ws.onMessage(onSocketMessage)

  return { useStore }
}
