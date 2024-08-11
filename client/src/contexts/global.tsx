import { FC, PropsWithChildren, createContext, useContext } from "react"
import { CommentStore } from "../shared/comments.store"
import { Config } from "../types"

export interface StoreContextValue {
  store: CommentStore
  config: Config
}

export const GlobalContext = createContext({} as StoreContextValue)

export const GlobalProvider: FC<
  PropsWithChildren & { store: CommentStore; config: Config }
> = ({ children, store, config }) => {
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
