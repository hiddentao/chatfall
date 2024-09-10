import { type VariantProps, cva } from "class-variance-authority"
import * as React from "react"
import { cn } from "../utils/ui"
import { Loading } from "./Loading"

export const buttonVariants = cva(
  "hover:scale-105 inline-flex bg-primary text-primary-content items-center rounded-md justify-center text-sm ring-offset-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/75 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "p-2 border border-primary",
        icon: "svg-container border border-primary p-[0.1em] ",
        iconMeta:
          "svg-container p-[0.1em] bg-transparent text-primary hover:bg-primary hover:text-primary-content",
        link: "p-0 bg-transparent text-primary hover:bg-primary hover:text-primary-content",
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
  tooltipClassName?: string
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant,
      inProgress = false,
      title,
      tooltipClassName,
      ...props
    },
    ref,
  ) => {
    const content = React.useMemo(
      () => (inProgress ? <Loading className="w-4 h-4 " /> : children),
      [inProgress, children],
    )

    return (
      <button
        className={cn(buttonVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        <div
          className={cn(
            "tooltip inline-flex flex-row justify-center items-center",
            tooltipClassName,
          )}
          data-tip={title}
        >
          {content}
        </div>
      </button>
    )
  },
)
