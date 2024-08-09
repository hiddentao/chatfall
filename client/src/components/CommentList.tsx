import { Sort } from "@chatfall/server"
import React, { FC, useEffect, useState } from "react"
import { useCallback } from "react"
import { CommentStore } from "../shared/comments.store"
import { ConfigProps } from "../types"
import { Button } from "./Button"
import { CommentListItem } from "./CommentListItem"
import { Loading } from "./Loading"
import { RefreshSvg } from "./Svg"

export type CommentListProps = ConfigProps & {
  store: CommentStore
}

export const CommentList: FC<CommentListProps> = ({
  store,
  title = "Comments",
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const { comments, users, fetchComments, sort } = store.useStore()

  const refetch = useCallback(
    async (s?: Sort) => {
      setIsLoading(true)
      setIsError(false)

      try {
        await fetchComments(s)
      } catch (error) {
        setIsError(true)
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
    <section className="flex flex-col">
      <div className="flex flex-row justify-between font-heading bg-pal1 p-4 rounded-md mb-6">
        <div className="text-xl flex flex-row items-center">
          {title}
          <Button
            className="w-6 h-6 ml-2"
            title="Reload"
            onClick={handleReload}
          >
            <RefreshSvg />
          </Button>
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
      {isError ? <p>Error fetching comments</p> : null}
      {!isLoading && !isError && comments.length === 0 ? (
        <p>No comments</p>
      ) : null}
      {!isError && comments.length ? (
        <ul className="flex flex-col px-1">
          {comments.map((c) => (
            <CommentListItem
              key={c.id}
              className="mb-8"
              comment={c}
              user={users[c.userId]}
            />
          ))}
        </ul>
      ) : null}
    </section>
  )
}
