import { Sort } from "@chatfall/server"
import React, { FC, useEffect, useState } from "react"
import { useCallback } from "react"
import { useStoreContext } from "../contexts/store"
import { ConfigProps } from "../types"
import { Button } from "./Button"
import { CommentInputForm } from "./CommentInputForm"
import { CommentListItem } from "./CommentListItem"
import { ErrorBox } from "./ErrorBox"
import { Loading } from "./Loading"
import { RefreshSvg } from "./Svg"

export type CommentListProps = ConfigProps & {}

export const CommentList: FC<CommentListProps> = ({ title = "Comments" }) => {
  const { store } = useStoreContext()

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
    <section className="flex flex-col">
      <div className="flex flex-row justify-between font-heading bg-pal1 px-4 py-3 rounded-md">
        <div className="text-xl flex flex-row items-center">
          {title}
          <Button
            className="w-6 h-6 ml-2"
            title="Reload"
            onClick={handleReload}
            variant="icon"
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
      <div className="px-1">
        <CommentInputForm className="my-4" />
        {error ? <ErrorBox>{error}</ErrorBox> : null}
        {!isLoading && !error && comments.length === 0 ? (
          <p>No comments</p>
        ) : null}
        {!error && comments.length ? (
          <ul className="flex flex-col">
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
      </div>
    </section>
  )
}
