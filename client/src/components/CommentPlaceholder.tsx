import { FC } from "react"
import { PropsWithClassname } from "../types"
import { cn } from "../utils/ui"

export const CommentPlaceholder: FC<PropsWithClassname> = ({ className }) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="skeleton h-8 w-1/2" />
      <div className="mt-4 skeleton h-20 w-full" />
    </div>
  )
}

export const CommentsBlockPlaceholder: FC<
  PropsWithClassname & { numComments?: number }
> = ({ className, numComments = 3 }) => {
  return (
    <div className={className}>
      {Array.from({ length: numComments }).map((_, i) => (
        <CommentPlaceholder key={i} className={i === 0 ? "" : "mt-6"} />
      ))}
    </div>
  )
}
