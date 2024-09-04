import { Comment, CommentUser, formatCommentTime } from "@chatfall/server"
import React, { FC, useCallback, useMemo, useState } from "react"
import { useGlobalContext } from "../contexts/global"
import { PropsWithClassname } from "../types"
import { cn } from "../utils/ui"
import { AnimatedNumber } from "./AnimatedNumber"
import { Button } from "./Button"
import { CommentInputForm } from "./CommentInputForm"
import { ErrorBox } from "./ErrorBox"
import { Loading } from "./Loading"
import { LoginWrapper, LoginWrapperChildProps } from "./Login"
import { ChatSvg, LikeSvg, LikedSvg, ReplySvg } from "./Svg"

export type CommentProps = PropsWithClassname & {
  comment: Comment
  user: CommentUser
  liked: boolean
}

const CommentListItemInner: FC<CommentProps & LoginWrapperChildProps> = ({
  className,
  comment: c,
  user,
  liked,
  login,
  renderedLoginForm,
}) => {
  const { store } = useGlobalContext()
  const { loggedInUser, likeComment, fetchReplies, ...s } = store.useStore()
  const [showingReplies, setShowingReplies] = useState<boolean>(false)
  const [showReplyForm, setShowReplyForm] = useState<boolean>(false)
  const [updatingLike, setUpdatingLike] = useState<boolean>(false)
  const [loadingReplies, setLoadingReplies] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  const myReplies = useMemo(() => s.replies[c.id] || null, [s.replies, c.id])

  const handleLike = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      try {
        await login()
        setError("")
        setUpdatingLike(true)
        await likeComment(c.id, !liked)
      } catch (err: any) {
        setError(err.toString())
      } finally {
        setUpdatingLike(false)
      }
    },
    [c.id, liked, likeComment, login],
  )

  const handleToggleReplies = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      try {
        setShowingReplies((prev) => !prev)
        if (!showingReplies && !s.replies[c.id]) {
          setLoadingReplies(true)
          setError("")
          await fetchReplies(c.id)
        }
      } catch (err: any) {
        setError(err.toString())
      } finally {
        setLoadingReplies(false)
      }
    },
    [c.id, fetchReplies, showingReplies, s.replies],
  )

  const handleToggleReplyForm = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      setShowReplyForm((prev) => !prev)
    },
    [],
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
        <Button
          variant="link"
          className="ml-4 inline-flex justify-start items-center"
          title={"Reply"}
          onClick={handleToggleReplyForm}
        >
          <div className="svg-container w-4 h-4 mx-1">
            <ReplySvg />
          </div>
          Reply
        </Button>
        {c.replyCount ? (
          <Button
            variant="link"
            className="ml-8 inline-flex justify-start items-center"
            title={"Show/hide replies"}
            onClick={handleToggleReplies}
          >
            <div className="svg-container w-4 h-4 mr-1">
              <ChatSvg />
            </div>
            <AnimatedNumber value={c.replyCount} />
            &nbsp;replies
          </Button>
        ) : null}
      </div>
      <CommentInputForm
        className={cn("max-h-0 p-0 border-0", {
          "max-h-72 border p-4 mx-6 mt-4": showReplyForm,
        })}
        parentCommentId={c.id}
        commentFieldPlaceholder="Add reply..."
        initiallyFocused={true}
      />
      {showingReplies ? (
        loadingReplies ? (
          <Loading className="mt-4 ml-4" />
        ) : (
          <>
            {myReplies ? (
              <div className="mt-3 p-4 flex flex-row">
                <div className="border-r border-r-gray-400 w-1"></div>
                <div className="ml-8">
                  <ul className="flex flex-col">
                    {myReplies.items.map((r) => (
                      <CommentListItem
                        key={r}
                        className="mb-8 last-of-type:mb-0"
                        comment={s.comments[r]}
                        user={s.users[s.comments[r].userId]}
                        liked={s.liked[r]}
                      />
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </>
        )
      ) : null}
      {renderedLoginForm}
      {error && (
        <ErrorBox className="mt-2" hideError={onHideError}>
          {error}
        </ErrorBox>
      )}
    </li>
  )
}

export const CommentListItem: FC<CommentProps> = ({
  className,
  comment: c,
  user,
  liked,
}) => {
  return (
    <LoginWrapper>
      {(props) => (
        <CommentListItemInner
          className={className}
          comment={c}
          user={user}
          liked={liked}
          {...props}
        />
      )}
    </LoginWrapper>
  )
}
