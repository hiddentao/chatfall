import { FC, useEffect, useState } from "react"
import AnimatedNumbers from "react-animated-numbers"
import { PropsWithClassname } from "../types"
import { cn } from "../utils/ui"

export const AnimatedNumber: FC<PropsWithClassname & { value: number }> = ({
  value,
  className,
}) => {
  // Re-render the component when the window is resized
  // See https://github.com/heyman333/react-animated-numbers/issues/37
  const [key, setKey] = useState(0)
  useEffect(() => {
    const updateKey = () => setKey((prev) => prev + 1)
    addEventListener("resize", updateKey)
    return () => {
      removeEventListener("resize", updateKey)
    }
  }, [])

  return (
    <span className={cn("inline-block", className)}>
      <AnimatedNumbers
        className={className}
        key={`${key}`}
        animateToNumber={value}
      />
    </span>
  )
}
