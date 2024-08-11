import { FC } from "react"
import { PropsWithClassname } from "../types"
import { cn } from "../utils/ui"
import { WaterfallSvg } from "./Svg"

export const Loading: FC<PropsWithClassname> = ({ className }) => {
  return (
    <div
      className={cn(
        "cf-svg-container cf-animate-bounce cf-w-14 cf-h-14",
        className,
      )}
    >
      <WaterfallSvg />
    </div>
  )
}
