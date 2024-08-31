import { Comment, CommentUser, formatCommentTime } from "@chatfall/server"
import React, { FC, useCallback, useState } from "react"
import { useGlobalContext } from "../contexts/global"
import { PropsWithClassname } from "../types"
import { cn } from "../utils/ui"
import { AnimatedNumber } from "./AnimatedNumber"
import { Button } from "./Button"
import { ErrorBox } from "./ErrorBox"
import { Loading } from "./Loading"
import { LikeSvg, LikedSvg, ReplySvg, RightSvg } from "./Svg"

export type CommentProps = PropsWithClassname & {
  comment: Comment
  user: CommentUser
  liked: boolean
}

export const CommentListItem: FC<CommentProps> = ({
  className,
  comment: c,
  user,
  liked,
}) => {
  const { store } = useGlobalContext()
  const { likeComment } = store.useStore()
  const [updatingLike, setUpdatingLike] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const handleLike = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      try {
        setUpdatingLike(true)
        setError("")
        await likeComment(c.id, !liked)
      } catch (err: any) {
        setError(err.toString())
      } finally {
        setUpdatingLike(false)
      }
    },
    [c.id, liked, likeComment],
  )

  const onHideError = useCallback(() => {
    setError("")
  }, [])

  return (
    <li className={cn("block", className)}>
      <div className="text-sm flex flex-row items-center mb-2">
        <h3 className="font-bold">{user.name}</h3>
        <span className="mx-2">·</span>
        <span
          title={`${c.createdAt}`}
          className="text-gray-400 text-xs"
        >{`${formatCommentTime(c.createdAt)}`}</span>{" "}
      </div>
      <div className="mb-2">{c.body}</div>
      <div className="mt-2 flex flex-row items-center text-xs">
        <span className="inline-flex flex-row items-center text-gray-500 mr-2">
          <AnimatedNumber value={c.rating} />
          <Button
            className="w-6 h-6 ml-1 p-[0.3em]"
            variant="iconMeta"
            title="Like/unlike"
            onClick={handleLike}
          >
            {updatingLike ? (
              <Loading className="w-4 h-4" />
            ) : liked ? (
              <LikedSvg />
            ) : (
              <LikeSvg />
            )}
          </Button>
        </span>
        {c.replyCount ? (
          <Button
            variant="link"
            className="ml-4 inline-flex justify-start items-center"
            title="View comments"
          >
            <AnimatedNumber value={c.replyCount} />
            <div className="svg-container w-4 h-4 ml-1">
              <ReplySvg />
            </div>
            <div className="svg-container w-4 h-4 ml-1">
              <RightSvg />
            </div>
          </Button>
        ) : null}
        {error && (
          <ErrorBox className="mt-2" hideError={onHideError}>
            {error}
          </ErrorBox>
        )}
      </div>
    </li>
  )
}
