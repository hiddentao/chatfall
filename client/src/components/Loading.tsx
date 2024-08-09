import { FC } from "react"
import { PropsWithClassname } from "../types"
import { cn } from "../utils"
import { WaterfallSvg } from "./Svg"

export const Loading: FC<PropsWithClassname> = ({ className }) => {
  return (
    <div className={cn("svg-conta]iner animate-bounce w-14 h-14", className)}>
      <WaterfallSvg />
    </div>
  )
}
