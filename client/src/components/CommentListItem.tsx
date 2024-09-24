import { Comment, CommentUser, formatCommentTime } from "@chatfall/server"
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useGlobalContext } from "../contexts/global"
import { ClientStore } from "../store/client"
import { PropsWithClassname } from "../types"
import { cn, formatPlural } from "../utils/ui"
import { Button } from "./Button"
import { CommentBody } from "./CommentBody"
import { CommentInputForm, CommentInputFormHandle } from "./CommentInputForm"
import { CommentsBlockPlaceholder } from "./CommentPlaceholder"
import { ErrorBox } from "./ErrorBox"
import { Loading } from "./Loading"
import { ButtonWithLogin } from "./Login"
import { NumberValue } from "./NumberValue"
import { ChatSvg, LikeSvg, LikedSvg, ReplySvg } from "./Svg"

export type CommentProps = PropsWithClassname & {
  comment: Comment
  user: CommentUser
  liked: boolean
  renderExtraControls?: (comment: Comment) => React.ReactNode
  disableActions?: boolean
  disableAnimatedNumber?: boolean
}

const CommentListItemInner: FC<CommentProps> = ({
  className,
  comment: c,
  user,
  liked,
  renderExtraControls,
  disableActions,
  disableAnimatedNumber,
}) => {
  const { store } = useGlobalContext<ClientStore>()
  const { loggedInUser, likeComment, fetchReplies, ...s } = store.useStore()
  const [showingReplies, setShowingReplies] = useState<boolean>(false)
  const [updatingLike, setUpdatingLike] = useState<boolean>(false)
  const [loadingReplies, setLoadingReplies] = useState<boolean>(false)
  const [scrollToReplyForm, setScrollToReplyForm] = useState<boolean>(false)
  const [scrollToFirstReply, setScrollToFirstReply] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const replyListRef = useRef<HTMLUListElement>(null)
  const replyFormRef = useRef<CommentInputFormHandle>(null)

  const myReplies = useMemo(() => s.replies[c.id] || null, [s.replies, c.id])

  const handleLike = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      try {
        setError("")
        setUpdatingLike(true)
        await likeComment(c.id, !liked)
      } catch (err: any) {
        setError(err.toString())
      } finally {
        setUpdatingLike(false)
      }
    },
    [c.id, liked, likeComment],
  )

  const fetchMoreReplies = useCallback(async () => {
    try {
      setLoadingReplies(true)
      setError("")
      await fetchReplies({ parentCommentId: c.id })
    } catch (err: any) {
      setError(err.toString())
    } finally {
      setLoadingReplies(false)
    }
  }, [c.id, fetchReplies])

  const handleToggleReplies = useCallback(
    async (
      event?: React.MouseEvent<HTMLButtonElement>,
      onceLoaded?: () => void,
    ) => {
      event?.preventDefault()

      if (!onceLoaded) {
        onceLoaded = () => {
          setScrollToFirstReply(true)
        }
      }

      setShowingReplies((prev) => !prev)
      if (!showingReplies && !s.replies[c.id]) {
        try {
          setError("")
          await fetchMoreReplies()
          onceLoaded()
        } catch (err: any) {
          setError(err.toString())
        }
      } else {
        onceLoaded()
      }
    },
    [c.id, fetchMoreReplies, showingReplies, s.replies],
  )

  const showReplyForm = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      if (!showingReplies) {
        handleToggleReplies(undefined, () => {
          setScrollToReplyForm(true)
        })
      } else {
        setScrollToReplyForm(true)
      }
    },
    [handleToggleReplies, showingReplies],
  )

  const handleClickLoadMoreReplies = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      fetchMoreReplies()
    },
    [fetchMoreReplies],
  )

  const canLoadMoreReplies = useMemo(
    () => myReplies && myReplies.items.length < myReplies.total,
    [myReplies],
  )

  const onHideError = useCallback(() => {
    setError("")
  }, [])

  const allItems = useMemo(() => {
    const items = [...(myReplies?.items || [])]
    if (myReplies?.myNewItems.length) {
      items.push(...myReplies.myNewItems)
    }
    return items
  }, [myReplies?.items, myReplies?.myNewItems])

  useEffect(() => {
    if (scrollToReplyForm && replyFormRef.current) {
      setScrollToReplyForm(false)
      replyFormRef.current.scrollIntoViewAndFocus()
    }
  }, [scrollToReplyForm])

  useEffect(() => {
    if (scrollToFirstReply && replyListRef.current) {
      setScrollToFirstReply(false)
      replyListRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }, [scrollToFirstReply])

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
      <div className="mb-2">
        <CommentBody body={c.body} />
      </div>
      <div className="mt-2 flex flex-row items-center text-xs">
        <span className="inline-flex flex-row items-center text-gray-500 mr-2">
          <NumberValue
            disableAnimatedNumber={disableAnimatedNumber}
            value={c.rating}
          />
          <ButtonWithLogin
            className="w-6 h-6 ml-1 p-[0.3em]"
            variant="iconMeta"
            title="Like/unlike"
            onClick={handleLike}
            disabled={disableActions}
          >
            {updatingLike ? (
              <Loading className="w-4 h-4" />
            ) : liked ? (
              <LikedSvg />
            ) : (
              <LikeSvg />
            )}
          </ButtonWithLogin>
        </span>
        {!disableActions && (
          <Button
            variant="link"
            className="ml-4 inline-flex justify-start items-center"
            title="Reply"
            onClick={showReplyForm}
          >
            <div className="svg-container w-4 h-4 mx-1">
              <ReplySvg />
            </div>
            Reply
          </Button>
        )}
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
            <NumberValue
              disableAnimatedNumber={disableAnimatedNumber}
              value={c.replyCount}
            />
            &nbsp;{formatPlural(c.replyCount, "reply", "replies")}
          </Button>
        ) : null}
        {renderExtraControls && renderExtraControls(c)}
      </div>
      {showingReplies ? (
        <div className="mt-3 p-4 flex flex-row">
          <div className="border-r border-r-gray-400 w-1"></div>
          <div className="flex-1 ml-8">
            {allItems.length ? (
              <>
                <ul className="flex flex-col" ref={replyListRef}>
                  {allItems.map((r) => (
                    <CommentListItem
                      key={r}
                      className="mb-8"
                      comment={s.comments[r]}
                      user={s.users[s.comments[r].userId]}
                      liked={s.liked[r]}
                      disableActions={disableActions}
                      disableAnimatedNumber={disableAnimatedNumber}
                    />
                  ))}
                </ul>
                {canLoadMoreReplies ? (
                  <Button
                    className={cn("mb-8", {
                      hidden: loadingReplies,
                    })}
                    onClick={handleClickLoadMoreReplies}
                    inProgress={loadingReplies}
                  >
                    Load more replies
                  </Button>
                ) : null}
              </>
            ) : null}
            {loadingReplies ? (
              <CommentsBlockPlaceholder className="mb-8" />
            ) : null}
            {disableActions ? null : (
              <CommentInputForm
                ref={replyFormRef}
                className={cn("p-4 w-full")}
                parentCommentId={c.id}
                commentFieldPlaceholder="Add reply..."
                initiallyFocused={true}
              />
            )}
          </div>
        </div>
      ) : null}
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
  renderExtraControls,
  disableActions,
  disableAnimatedNumber,
}) => {
  return (
    <CommentListItemInner
      className={className}
      comment={c}
      user={user}
      liked={liked}
      renderExtraControls={renderExtraControls}
      disableActions={disableActions}
      disableAnimatedNumber={disableAnimatedNumber}
    />
  )
}
