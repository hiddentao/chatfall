import { Sort } from "@chatfall/server"
import React, { FC, useEffect, useMemo, useState } from "react"
import { useCallback } from "react"
import { useGlobalContext } from "../contexts/global"
import { cn } from "../utils/ui"
import { AnimatedNumber } from "./AnimatedNumber"
import { Button } from "./Button"
import { CommentInputForm } from "./CommentInputForm"
import { CommentListItem } from "./CommentListItem"
import { CommentPlaceholder } from "./CommentPlaceholder"
import { ErrorBox } from "./ErrorBox"
import { Loading } from "./Loading"
import { ThemeSwitcher } from "./ThemeSwitcher"

export const CommentList: FC = () => {
  const {
    store,
    config: { title = "Comments" },
  } = useGlobalContext()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  const {
    canonicalUrl,
    comments,
    rootList,
    users,
    liked,
    fetchComments,
    sort,
  } = store.useStore()

  const refetch = useCallback(
    async (s?: Sort, skipOverride?: number) => {
      setIsLoading(true)
      setError("")

      try {
        await fetchComments(s, skipOverride)
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
      refetch(event.target.value as Sort, 0)
    },
    [refetch],
  )

  const handleShowNewComments = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      refetch(Sort.newest_first, 0)
    },
    [refetch],
  )

  const handleClickLoadMoreComments = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      refetch()
    },
    [refetch],
  )

  const canLoadMoreComments = useMemo(
    () => rootList.items.length < rootList.total,
    [rootList.items.length, rootList.total],
  )

  const allItems = useMemo(() => {
    const items = [...rootList.items]
    if (rootList.myNewItems.length) {
      items.unshift(...rootList.myNewItems)
    }
    return items
  }, [rootList.items, rootList.myNewItems])

  useEffect(() => {
    refetch()
  }, [refetch])

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between font-heading bg-info text-info-content px-4 py-3 rounded-md">
        <div className="text-xl flex flex-row items-center">
          {title}
          {isLoading ? <Loading className="ml-4 w-8 h-8" /> : null}
        </div>
        <div className="flex flex-row items-center justify-end">
          <div>
            <label htmlFor="sort-select" className="mr-2">
              Sort:
            </label>
            <select
              disabled={isLoading}
              id="sort-select"
              value={sort}
              onChange={handleSortChange}
              className="select select-sm rounded-md bg-neutral text-neutral-content"
            >
              <option value={Sort.newest_first}>Newest</option>
              <option value={Sort.oldest_first}>Oldest</option>
              <option value={Sort.highest_score}>Highest rated</option>
              <option value={Sort.lowest_score}>Lowest rated</option>
              <option value={Sort.most_replies}>Most replies</option>
              <option value={Sort.least_replies}>Least replies</option>
            </select>
          </div>
          <div className="ml-2">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
      <div className="px-1">
        {canonicalUrl ? <CommentInputForm className="mt-4 mb-8 mx-6" /> : null}
        {error ? <ErrorBox>{error}</ErrorBox> : null}
        {!isLoading && !error && rootList.items.length === 0 ? (
          <p>No comments yet!</p>
        ) : null}
        {rootList.otherUserNewItems.length ? (
          <div className="text-sm bg-green-200 py-2 px-4 mb-6 rounded-md">
            <div className="inline-block mr-2">
              <strong>
                <AnimatedNumber value={rootList.otherUserNewItems.length} /> new
                comment
                {rootList.otherUserNewItems.length > 1 ? "s" : ""}
              </strong>
              <span className="ml-2">available</span>
            </div>
            <Button
              className="inline-block text-sm py-1"
              onClick={handleShowNewComments}
            >
              Show
            </Button>
          </div>
        ) : null}
        {!error && rootList.items.length ? (
          <ul className="flex flex-col">
            {allItems.map((c) => (
              <CommentListItem
                key={c}
                className="mb-9"
                comment={comments[c]}
                user={users[comments[c].userId]}
                liked={liked[c]}
              />
            ))}
          </ul>
        ) : null}
        {canLoadMoreComments ? (
          <Button
            className={cn("mt-2 mb-4", {
              hidden: isLoading,
            })}
            onClick={handleClickLoadMoreComments}
            inProgress={isLoading}
          >
            Load more comments
          </Button>
        ) : null}
        {isLoading ? (
          <>
            <CommentPlaceholder />
            <CommentPlaceholder />
            <CommentPlaceholder />
            <CommentPlaceholder />
          </>
        ) : null}
      </div>
    </div>
  )
}
