import { FC, useMemo } from "react"

export const CommentBody: FC<{ body: string }> = ({ body }) => {
  const formattedBody = useMemo(() => {
    return body.split("\n").map((line, i) => (
      <p key={i} className="mb-1">
        {line || <br />}
      </p>
    ))
  }, [body])

  return <div>{formattedBody}</div>
}
