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
    <li className={cn("cf-block", className)}>
      <div className="cf-text-sm cf-flex cf-flex-row cf-items-center cf-mb-2">
        <h3 className="cf-font-bold">{user.username}</h3>
        <span className="cf-mx-2">·</span>
        <span
          title={`${c.createdAt}`}
          className="cf-text-gray-400 cf-text-xs"
        >{`${formatCommentTime(c.createdAt)}`}</span>{" "}
      </div>
      <div className="cf-mb-2">{c.body}</div>
      <div className="cf-mt-2 cf-flex cf-flex-row cf-items-center cf-text-xs">
        <span className="cf-inline-flex cf-flex-row cf-items-center cf-text-gray-500 cf-mr-2">
          <span>{c.rating}</span>
          <Button
            className="cf-w-6 cf-h-6 cf-ml-1 cf-p-[0.3em]"
            variant="iconMeta"
            title="Rate"
          >
            <LikeSvg />
          </Button>
        </span>
        {c.reply_count > 0 ? (
          <div className="cf-text-anchor cf-cursor-pointer">
            + {`${c.reply_count} replies`}
          </div>
        ) : null}
      </div>
    </li>
  )
}
