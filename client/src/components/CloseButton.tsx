import React, { FC } from "react"
import { Button } from "./Button"
import { CrossSvg } from "./Svg"

export const CloseButton: FC<{
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}> = ({ onClick }) => (
  <Button
    variant="iconMeta"
    className="w-4 h-4 p-1 absolute top-1 right-1"
    onClick={onClick}
  >
    <CrossSvg />
  </Button>
)
