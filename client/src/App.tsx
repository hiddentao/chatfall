import { FC } from "react"
import { CommentList } from "./components/CommentList"
import { createStore } from "./shared/comments.store"
import "./global.css"
import { StoreProvider } from "./contexts/store"
import { ConfigProps } from "./types"

export const createApp = (props: ConfigProps) => {
  const store = createStore(props)

  const App: FC = () => {
    return (
      <StoreProvider store={store}>
        <CommentList {...props} />
      </StoreProvider>
    )
  }

  return App
}
