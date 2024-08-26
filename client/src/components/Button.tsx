import { type VariantProps, cva } from "class-variance-authority"
import * as React from "react"
import { cn } from "../utils/ui"
import { Loading } from "./Loading"

export const buttonVariants = cva(
  "inline-flex text-anchor hover:text-white hover:bg-anchor items-center rounded-md justify-center text-sm ring-offset-anchor transition-colors focus-visible:outline-none focus-visible:ring-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "p-2 border border-anchor",
        icon: "svg-container border border-anchor p-[0.1em]",
        iconMeta: "svg-container p-[0.1em]",
        link: "p-0",
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
  ({ children, className, variant, inProgress = false, ...props }, ref) => {
    const content = React.useMemo(
      () => (inProgress ? <Loading className="w-4 h-4 " /> : children),
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

    return btn
  },
)
