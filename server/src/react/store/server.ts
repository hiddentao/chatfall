import {
  type CoreState,
  type StoreProps,
  createBaseStore,
} from "@chatfall/client"
import type { SocketEvent } from "../../exports"

export type ServerState = CoreState & {
  hasAdmin: () => Promise<boolean>
}

export type ServerStoreProps = StoreProps & {}

export const createStore = (props: ServerStoreProps) => {
  return createBaseStore<ServerState>(
    props,
    (_set, _get, app) =>
      ({
        hasAdmin: async () => {
          const res = await app.api.users.has_admin.get()
          return res.data
        },
      }) as Omit<ServerState, keyof CoreState>,
    (data: SocketEvent) => {
      console.log(data)
    },
  )
}

export type ServerStore = ReturnType<typeof createStore>
