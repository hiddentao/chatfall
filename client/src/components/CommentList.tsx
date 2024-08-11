import { Sort } from "@chatfall/server"
import React, { FC, useEffect, useState } from "react"
import { useCallback } from "react"
import { useGlobalContext } from "../contexts/global"
import { Button } from "./Button"
import { CommentInputForm } from "./CommentInputForm"
import { CommentListItem } from "./CommentListItem"
import { ErrorBox } from "./ErrorBox"
import { Loading } from "./Loading"
import { RefreshSvg } from "./Svg"

export const CommentList: FC = () => {
  const {
    store,
    config: { title = "Comments" },
  } = useGlobalContext()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  const { comments, users, fetchComments, sort } = store.useStore()

  const refetch = useCallback(
    async (s?: Sort) => {
      setIsLoading(true)
      setError("")

      try {
        await fetchComments(s)
      } catch (error: any) {
        setError(error.toString())
      } finally {
        setIsLoading(false)
      }
    },
    [fetchComments],
  )

  const handleSortChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      refetch(event.target.value as Sort)
    },
    [fetchComments],
  )

  const handleReload = useCallback(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    refetch()
  }, [refetch])

  return (
    <div className="cf-flex cf-flex-col">
      <div className="cf-flex cf-flex-row cf-justify-between cf-font-heading cf-bg-blue-200 cf-border cf-border-blue-500 cf-px-4 cf-py-3 cf-rounded-md">
        <div className="cf-text-xl cf-flex cf-flex-row cf-items-center">
          {title}
          <Button
            className="cf-w-6 cf-h-6 cf-ml-2"
            title="Reload"
            onClick={handleReload}
            variant="icon"
          >
            <RefreshSvg />
          </Button>
          {isLoading ? <Loading className="cf-ml-4 cf-w-8 cf-h-8" /> : null}
        </div>
        <div className="cf-flex cf-flex-row cf-items-center cf-justify-end">
          <label htmlFor="sort-select" className="cf-mr-2">
            Sort:
          </label>
          <select
            disabled={isLoading}
            id="sort-select"
            value={sort}
            onChange={handleSortChange}
            className="cf-rounded-md cf-p-1 "
          >
            <option value={Sort.newest_first}>Newest</option>
            <option value={Sort.oldest_first}>Oldest</option>
            <option value={Sort.highest_score}>Highest rated</option>
            <option value={Sort.lowest_score}>Lowest rated</option>
            <option value={Sort.most_replies}>Most replies</option>
            <option value={Sort.least_replies}>Least replies</option>
          </select>
        </div>
      </div>
      <div className="cf-px-1">
        <CommentInputForm className="cf-mt-4 cf-mb-8 cf-mx-6" />
        {error ? <ErrorBox>{error}</ErrorBox> : null}
        {!isLoading && !error && comments.length === 0 ? (
          <p>No comments</p>
        ) : null}
        {!error && comments.length ? (
          <ul className="cf-flex cf-flex-col">
            {comments.map((c) => (
              <CommentListItem
                key={c.id}
                className="cf-mb-9"
                comment={c}
                user={users[c.userId]}
              />
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}
