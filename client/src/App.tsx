import { FC } from "react"
import { CommentList } from "./components/CommentList"
import { createStore } from "./shared/comments.store"
import "./global.css"
import { ConfigProps } from "./types"

export const createApp = (props: ConfigProps) => {
  const store = createStore(props)

  const App: FC = () => {
    return <CommentList store={store} {...props} />
  }

  return App
}
