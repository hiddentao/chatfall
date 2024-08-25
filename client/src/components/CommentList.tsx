import { Sort } from "@chatfall/server"
import React, { FC, useEffect, useState } from "react"
import { useCallback } from "react"
import { useGlobalContext } from "../contexts/global"
import { CommentInputForm } from "./CommentInputForm"
import { CommentListItem } from "./CommentListItem"
import { ErrorBox } from "./ErrorBox"
import { Loading } from "./Loading"

export const CommentList: FC = () => {
  const {
    store,
    config: { title = "Comments" },
  } = useGlobalContext()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  const { comments, users, liked, fetchComments, sort } = store.useStore()

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

  useEffect(() => {
    refetch()
  }, [refetch])

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between font-heading bg-blue-200 border border-blue-500 px-4 py-3 rounded-md">
        <div className="text-xl flex flex-row items-center">
          {title}
          {isLoading ? <Loading className="ml-4 w-8 h-8" /> : null}
        </div>
        <div className="flex flex-row items-center justify-end">
          <label htmlFor="sort-select" className="mr-2">
            Sort:
          </label>
          <select
            disabled={isLoading}
            id="sort-select"
            value={sort}
            onChange={handleSortChange}
            className="rounded-md p-1 "
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
      <div className="px-1">
        <CommentInputForm className="mt-4 mb-8 mx-6" />
        {error ? <ErrorBox>{error}</ErrorBox> : null}
        {!isLoading && !error && comments.length === 0 ? (
          <p>No comments</p>
        ) : null}
        {!error && comments.length ? (
          <ul className="flex flex-col">
            {comments.map((c) => (
              <CommentListItem
                key={c.id}
                className="mb-9"
                comment={c}
                user={users[c.userId]}
                liked={liked[c.id]}
              />
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  )
}