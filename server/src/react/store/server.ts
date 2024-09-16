import {
  type CoreState,
  type StoreProps,
  createBaseStore,
} from "@chatfall/client"
import { produce } from "immer"
import type { Settings, SocketEvent } from "../../exports"
import type { Setting, SettingValue } from "../../settings/types"

export type ServerState = CoreState & {
  settings?: Settings
  hasAdmin: () => Promise<boolean>
  loadSettings: () => Promise<void>
  setSetting: (key: Setting, value: SettingValue<typeof key>) => Promise<void>
}

export type ServerStoreProps = StoreProps & {}

export const createStore = (props: ServerStoreProps) => {
  return createBaseStore<ServerState>(
    props,
    (set, get, tryCatchApiCall, app) =>
      ({
        settings: undefined,
        hasAdmin: async () => {
          const data = await tryCatchApiCall<boolean>(set, () =>
            app.api.users.has_admin.get(),
          )

          return data
        },
        loadSettings: async () => {
          const data = await tryCatchApiCall<Settings>(set, () =>
            app.api.settings.index.get(),
          )

          set(
            produce((state) => {
              state.settings = data
            }),
          )
        },
        setSetting: async (key, value) => {
          // optimistic update
          const originalSettings = get().settings

          set(
            produce((state) => {
              state.settings[key] = value
            }),
          )

          try {
            const newSettings = await tryCatchApiCall<Settings>(set, () =>
              app.api.settings.index.put({
                key,
                value,
              }),
            )

            set(
              produce((state) => {
                state.settings = newSettings
              }),
            )
          } catch (error) {
            set(
              produce((state) => {
                state.settings = originalSettings
              }),
            )
            throw error
          }
        },
      }) as Omit<ServerState, keyof CoreState>,
    (useStore, data: SocketEvent) => {
      console.log(useStore, data)
    },
  )
}

export type ServerStore = ReturnType<typeof createStore>
