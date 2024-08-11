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
        "cf-relative cf-bg-red-100 cf-border cf-border-red-500 cf-text-black cf-p-2 cf-pr-4 cf-rounded-md",
        className,
      )}
    >
      {hideError && (
        <Button
          onClick={hide}
          variant="iconMeta"
          className="cf-absolute cf-right-[3px] cf-top-[5px] cf-w-4 cf-h-4 cf-p-1"
        >
          <CrossSvg />
        </Button>
      )}
      {errMsg}
    </div>
  )
}
