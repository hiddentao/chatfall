import { Sort } from "@chatfall/server"
import React, { FC, useEffect, useState } from "react"
import { useCallback } from "react"
import { CommentStore } from "../shared/comments.store"
import { ConfigProps } from "../types"
import { Loading } from "./Loading"

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

  useEffect(() => {
    refetch()
  }, [refetch])

  return (
    <section className="flex flex-col">
      <div className="flex flex-row justify-between font-heading bg-pal1 p-4 rounded-md">
        <div className="text-xl">{title}</div>
        <div className="flex flex-row items-center justify-end">
          <label htmlFor="sort-select" className="mr-2">
            Sort:
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={handleSortChange}
            className="rounded-md p-1 "
          >
            <option value={Sort.newest_first}>Newest first</option>
            <option value={Sort.oldest_first}>Oldest first</option>
            <option value={Sort.highest_score}>Highest rated</option>
            <option value={Sort.lowest_score}>Lowest rated</option>
            <option value={Sort.most_replies}>Most replies</option>
            <option value={Sort.least_replies}>Least replies</option>
          </select>
        </div>
      </div>
      {isLoading ? <Loading className="mx-auto mt-4" /> : null}
      {isError ? <p>Error fetching comments</p> : null}
      {!isLoading && !isError && comments.length === 0 ? (
        <p>No comments</p>
      ) : null}
      {!isLoading && !isError && comments.length ? (
        <ul className="flex flex-col gap-2">
          {comments.map((c) => (
            <li key={c.id} className="block">
              <div className="flex flex-row">
                <h3 className="font-bold">{users[c.userId].username}</h3>
                <span className="text-gray-400 ml-2">{`${c.createdAt}`}</span>{" "}
                {/* Display the selected sorting parameter */}
                <span className="text-gray-800 ml-2">{`Rating: ${c.rating}`}</span>
              </div>
              <div>{c.body}</div>
              {c.reply_count > 0 && (
                <div className="mt-4">{`Replies: ${c.reply_count}`}</div>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
