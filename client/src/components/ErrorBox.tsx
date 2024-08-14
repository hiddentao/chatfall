import { FC, useCallback, useMemo } from "react"
import { PropsWithClassname } from "../types"
import { cn } from "../utils/ui"
import { Button } from "./Button"
import { CrossSvg } from "./Svg"

export const ErrorBox: FC<
  PropsWithClassname & { children: string; hideError?: () => void }
> = ({ className, children, hideError }) => {
  const hide = useCallback(() => {
    if (hideError) {
      hideError()
    }
  }, [])

  const errMsg = useMemo(() => {
    try {
      // might be in form: Error: { "name": "Error", "message": "test" }
      // regex to extract the message
      const match = children.match(/"message":"(.*?)"/i)
      if (match && match[1]) {
        return `Error: ${match[1]}`
      }
    } finally {
    }

    return children
  }, [children])

  return (
    <div
      className={cn(
        "relative bg-red-100 border border-red-500 text-black p-2 pr-4 rounded-md",
        className,
      )}
    >
      {hideError && (
        <Button
          onClick={hide}
          variant="iconMeta"
          className="absolute right-[3px] top-[5px] w-4 h-4 p-1"
        >
          <CrossSvg />
        </Button>
      )}
      {errMsg}
    </div>
  )
}
