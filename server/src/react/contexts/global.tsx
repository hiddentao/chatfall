import { type Config } from "@chatfall/client"
import {
  type FC,
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
} from "react"
import { type ServerStore } from "../store/server"

export interface StoreContextValue {
  store: ServerStore
  config: Config
}

export const GlobalContext = createContext({} as StoreContextValue)

export const GlobalProvider: FC<
  PropsWithChildren & { store: ServerStore; config: Config }
> = ({ children, store, config }) => {
  const { loggedInUser, checkAuth } = store.useStore()

  // check auth upon startup
  useEffect(() => {
    if (!loggedInUser) {
      checkAuth()
    }
  }, [checkAuth, loggedInUser])

  return (
    <GlobalContext.Provider
      value={{
        store,
        config,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export const GlobalConsumer = GlobalContext.Consumer

export const useGlobalContext = () => {
  return useContext(GlobalContext)
}
