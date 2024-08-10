import { FC, PropsWithChildren, createContext, useContext } from "react"
import { CommentStore } from "../shared/comments.store"

export interface StoreContextValue {
  store: CommentStore
}

export const StoreContext = createContext({} as StoreContextValue)

export const StoreProvider: FC<PropsWithChildren & { store: CommentStore }> = ({
  children,
  store,
}) => {
  return (
    <StoreContext.Provider
      value={{
        store,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export const GlobalConsumer = StoreContext.Consumer

export const useStoreContext = () => {
  return useContext(StoreContext)
}
