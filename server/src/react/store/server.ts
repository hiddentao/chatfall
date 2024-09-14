import {
  type CoreState,
  type StoreProps,
  createBaseStore,
} from "@chatfall/client"
import { produce } from "immer"
import type { Settings, SocketEvent } from "../../exports"

export type ServerState = CoreState & {
  settings?: Settings
  hasAdmin: () => Promise<boolean>
  loadSettings: () => Promise<void>
}

export type ServerStoreProps = StoreProps & {}

export const createStore = (props: ServerStoreProps) => {
  return createBaseStore<ServerState>(
    props,
    (set, _get, app) =>
      ({
        settings: undefined,
        hasAdmin: async () => {
          const { data, error } = await app.api.users.has_admin.get()

          if (error) {
            throw error
          }

          return data
        },
        loadSettings: async () => {
          const { data, error } = await app.api.settings.index.get()

          if (error) {
            throw error
          }

          set(
            produce((state) => {
              state.settings = data
            }),
          )
        },
      }) as Omit<ServerState, keyof CoreState>,
    (useStore, data: SocketEvent) => {
      console.log(useStore, data)
    },
  )
}

export type ServerStore = ReturnType<typeof createStore>
