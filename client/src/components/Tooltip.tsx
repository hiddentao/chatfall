import { FC, PropsWithChildren, ReactNode, useMemo } from "react"
import { usePopperTooltip } from "react-popper-tooltip"
import { useMobile } from "../hooks"
import { cn } from "../utils/ui"
import "./Tooltip.module.css"

export type TooltipProps = PropsWithChildren & {
  className?: string
  style?: Record<string, string>
  triggerContent?: ReactNode
}

export const Tooltip: FC<TooltipProps> = (props) => {
  const { className, style, children, triggerContent } = props

  const isMobile = useMobile()
  const triggerType = useMemo(() => (isMobile ? "click" : "hover"), [isMobile])

  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({
    trigger: triggerType,
    followCursor: true,
  })

  return (
    <span
      className={cn(
        "cf-inline-flex cf-flex-col cf-justify-center cf-items-center",
        className,
      )}
      style={style}
      ref={setTriggerRef}
    >
      {triggerContent}
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: "tooltip-container" })}
        >
          <div {...getArrowProps({ className: "tooltip-arrow" })} />
          {children}
        </div>
      )}
    </span>
  )
}
