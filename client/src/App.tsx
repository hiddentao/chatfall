import { FC, useEffect, useState } from "react"
import { CommentList } from "./components/CommentList"
import { createStore } from "./shared/comments.store"
import "./App.css"
import { ConfigProps } from "./types"

export const createApp = (props: ConfigProps) => {
  const store = createStore(props)

  const App: FC = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    const { fetchComments } = store.useStore()

    useEffect(() => {
      ;(async () => {
        try {
          await fetchComments()
          await new Promise((resolve) => setTimeout(resolve, 1000))
        } catch (error) {
          setIsError(true)
        } finally {
          setIsLoading(false)
        }
      })()
    }, [fetchComments])

    return (
      <div className="p-4">
        {isLoading ? <p>Loading...</p> : null}
        {isError ? <p>Error fetching comments</p> : null}
        {!isLoading && !isError ? (
          <CommentList store={store} {...props} />
        ) : null}
      </div>
    )
  }

  return App
}
