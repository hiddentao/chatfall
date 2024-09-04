import { FC } from "react"

export const CommentPlaceholder: FC = () => {
  return (
    <div className="flex flex-col my-6">
      <div className="skeleton h-8 w-1/2" />
      <div className="mt-4 skeleton h-20 w-full" />
    </div>
  )
}
