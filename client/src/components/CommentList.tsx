import { Sort } from "@chatfall/server"
import { FC, useMemo } from "react"
import { useGlobalContext } from "../contexts/global"
import { type ClientStore } from "../store/client"
import { CommentInputForm } from "./CommentInputForm"
import { CommentListBase, CommentListBaseProps } from "./CommentListBase"

export const CommentList: FC = () => {
  const {
    store,
    config: { title = "Comments" },
  } = useGlobalContext<ClientStore>()
  const { canonicalUrl } = store.useStore()

  const renderHeaderContent = useMemo(() => {
    const fn: CommentListBaseProps["renderHeaderContent"] = ({
      setIsLoading,
      setError,
    }) => {
      return (
        <DefaultCommentFilters
          setIsLoading={setIsLoading}
          setError={setError}
        />
      )
    }

    return fn
  }, [])

  const renderPreCommentContent = useMemo(() => {
    const fn: CommentListBaseProps["renderPreCommentContent"] = () => {
      return canonicalUrl ? (
        <>
          <CommentInputForm className="mt-4 mb-8 mx-6" />
        </>
      ) : null
    }

    return fn
  }, [canonicalUrl])

  return (
    <>
      <CommentListBase
        title={title}
        showHeader={true}
        renderHeaderContent={renderHeaderContent}
        renderPreCommentContent={renderPreCommentContent}
      />
    </>
  )
}

interface CommentFiltersProps {
  setIsLoading: (isLoading: boolean) => void
  setError: (error: string) => void
}

export const DefaultCommentFilters: FC<CommentFiltersProps> = ({
  setIsLoading,
  setError,
}) => {
  const { store } = useGlobalContext<ClientStore>()
  const { fetchComments, rootList } = store.useStore()

  const fetchNewComments = async (s?: Sort) => {
    setIsLoading(true)
    setError("")

    try {
      await fetchComments({ sort: s, skipOverride: 0 })
    } catch (error: any) {
      setError(error.toString())
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <label htmlFor="sort-select" className="mr-2">
        Sort:
      </label>
      <select
        id="sort-select"
        value={rootList.sort}
        className="select select-sm rounded-md text-base-content"
        onChange={(e) => fetchNewComments(e.target.value as Sort)}
      >
        <option value={Sort.newestFirst}>Newest</option>
        <option value={Sort.oldestFirst}>Oldest</option>
        <option value={Sort.highestScore}>Highest rated</option>
        <option value={Sort.lowestScore}>Lowest rated</option>
        <option value={Sort.mostReplies}>Most replies</option>
        <option value={Sort.leastReplies}>Least replies</option>
      </select>
    </div>
  )
}
