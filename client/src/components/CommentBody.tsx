import { Comment, CommentStatus } from "@chatfall/server"
import { FC, ReactNode, useMemo } from "react"
import { cn } from "../utils/ui"

export const CommentBody: FC<{ comment: Comment; isAdminView?: boolean }> = ({
  comment,
  isAdminView,
}) => {
  const formattedBody = useMemo(() => {
    let lines: ReactNode[] = []

    const isVisible = comment.status === CommentStatus.Visible

    if (isAdminView || isVisible) {
      lines = comment.body.split("\n").map((line, i) => (
        <p
          key={i}
          className={cn("mb-1", {
            "line-through": comment.status === CommentStatus.Deleted,
          })}
        >
          {line || <br />}
        </p>
      ))
    }

    if (comment.status === CommentStatus.Deleted) {
      lines.unshift(
        <p key="deleted" className="italic text-gray-500">
          [deleted]
        </p>,
      )
    }

    if (comment.status === CommentStatus.Moderation) {
      lines.unshift(
        <p key="moderation" className="italic text-gray-500">
          [awaiting moderation]
        </p>,
      )
    }

    return lines
  }, [comment.body, isAdminView, comment.status])

  return <div>{formattedBody}</div>
}
