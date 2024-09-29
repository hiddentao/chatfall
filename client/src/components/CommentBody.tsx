import { Comment, CommentStatus } from "@chatfall/server"
import { FC, useMemo } from "react"

export const CommentBody: FC<{ comment: Comment }> = ({ comment }) => {
  const formattedBody = useMemo(() => {
    if (comment.status === CommentStatus.Deleted) {
      return <p className="italic text-gray-500">[deleted]</p>
    }

    return comment.body.split("\n").map((line, i) => (
      <p key={i} className="mb-1">
        {line || <br />}
      </p>
    ))
  }, [comment.body, comment.status])

  return <div>{formattedBody}</div>
}
