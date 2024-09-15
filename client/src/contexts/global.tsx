import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
} from "react"
import { BaseStore } from "../exports"
import { type Config } from "../types"

export interface StoreContextValue<T extends BaseStore> {
  store: T
  config: Config
}

export const GlobalContext = createContext({} as StoreContextValue<BaseStore>)

export const GlobalProvider: FC<
  PropsWithChildren & { store: BaseStore; config: Config }
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

export const useGlobalContext = <T extends BaseStore>() => {
  return useContext(GlobalContext) as StoreContextValue<T>
}
