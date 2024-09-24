import { FC, useMemo } from "react"
import { useGlobalContext } from "../contexts/global"
import { type ClientStore } from "../store/client"
import { CommentInputForm } from "./CommentInputForm"
import { CommentListBase } from "./CommentListBase"

export const CommentList: FC = () => {
  const {
    store,
    config: { title = "Comments" },
  } = useGlobalContext<ClientStore>()
  const { canonicalUrl } = store.useStore()

  const headerContent = (
    <>
      <div>
        <label htmlFor="sort-select" className="mr-2">
          Sort:
        </label>
        <select
          id="sort-select"
          className="select select-sm rounded-md bg-neutral text-neutral-content"
        >
          <option value="newestFirst">Newest</option>
          <option value="oldestFirst">Oldest</option>
          <option value="highestScore">Highest rated</option>
          <option value="lowestScore">Lowest rated</option>
          <option value="mostReplies">Most replies</option>
          <option value="leastReplies">Least replies</option>
        </select>
      </div>
    </>
  )

  const preCommentContent = useMemo(() => {
    return canonicalUrl ? (
      <>
        <CommentInputForm className="mt-4 mb-8 mx-6" />
      </>
    ) : null
  }, [canonicalUrl])

  return (
    <>
      <CommentListBase
        title={title}
        showHeader={true}
        headerContent={headerContent}
        preCommentContent={preCommentContent}
      />
    </>
  )
}
