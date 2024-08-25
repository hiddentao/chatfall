import { FC } from "react"
import { CommentList } from "./components/CommentList"
import "./global.css"
import { GlobalProvider } from "./contexts/global"
import { createStore } from "./shared/comments.store"
import { Config } from "./types"

export const createApp = (config: Config) => {
  const store = createStore(config)

  const App: FC = () => {
    return (
      <GlobalProvider store={store} config={config}>
        <CommentList />
      </GlobalProvider>
    )
  }

  return App
}