import { Comment, CommentUser } from "@chatfall/server"
import { FC } from "react"
import { PropsWithClassname } from "../types"
import { formatCommentTime } from "../utils/date"
import { cn } from "../utils/ui"
import { Button } from "./Button"
import { LikeSvg } from "./Svg"

export type CommentProps = PropsWithClassname & {
  comment: Comment
  user: CommentUser
}

export const CommentListItem: FC<CommentProps> = ({
  className,
  comment: c,
  user,
}) => {
  return (
    <li className={cn("block", className)}>
      <div className="text-sm flex flex-row items-center mb-2">
        <h3 className="font-bold">{user.username}</h3>
        <span className="mx-2">·</span>
        <span
          title={`${c.createdAt}`}
          className="text-gray-400 text-xs"
        >{`${formatCommentTime(c.createdAt)}`}</span>{" "}
        <span className="mx-2">·</span>
      </div>
      <div className="mb-2">{c.body}</div>
      <div className="mt-2 flex flex-row items-center text-xs">
        <span className="inline-flex flex-row items-center text-gray-500 mr-2">
          <span>{c.rating}</span>
          <Button className="w-6 h-6 ml-1 p-1" variant="iconMeta" title="Rate">
            <LikeSvg />
          </Button>
        </span>
        {c.reply_count > 0 ? (
          <div className="text-anchor cursor-pointer">
            + {`${c.reply_count} replies`}
          </div>
        ) : null}
      </div>
    </li>
  )
}
