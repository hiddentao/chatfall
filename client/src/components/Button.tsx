import { type VariantProps, cva } from "class-variance-authority"
import * as React from "react"
import { cn } from "../utils/ui"
import { Loading } from "./Loading"
import { Tooltip } from "./Tooltip"

export const buttonVariants = cva(
  "cf-inline-flex cf-text-anchor hover:cf-text-white hover:cf-bg-anchor cf-items-center cf-rounded-md cf-justify-center cf-text-sm cf-ring-offset-anchor cf-transition-colors focus-visible:cf-outline-none focus-visible:cf-ring-2 focus-visible:cf-ring-slate-950 focus-visible:cf-ring-offset-2 disabled:cf-pointer-events-none disabled:cf-opacity-50",
  {
    variants: {
      variant: {
        default: "cf-p-2 cf-border cf-border-anchor",
        icon: "cf-svg-container cf-border cf-border-anchor cf-p-[0.1em]",
        iconMeta: "cf-svg-container cf-p-[0.1em]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  inProgress?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, className, variant, inProgress = false, title, ...props },
    ref,
  ) => {
    const content = React.useMemo(
      () => (inProgress ? <Loading className="w-4 h-4" /> : children),
      [inProgress, children],
    )

    const btn = (
      <button
        className={cn(buttonVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {content}
      </button>
    )

    if (title) {
      return <Tooltip triggerContent={btn}>{title}</Tooltip>
    } else {
      return btn
    }
  },
)
