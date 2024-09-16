import { Svg } from "@chatfall/client"
import { type ReactNode, useEffect, useState } from "react"

const SvgWrapper = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return children
}

export const LogoutSvg = () => (
  <SvgWrapper>
    <Svg.LogoutSvg />
  </SvgWrapper>
)
export const DarkSvg = () => (
  <SvgWrapper>
    <Svg.DarkSvg />
  </SvgWrapper>
)
export const LightSvg = () => (
  <SvgWrapper>
    <Svg.LightSvg />
  </SvgWrapper>
)

export const DropdownArrowSvg = () => (
  <SvgWrapper>
    <Svg.DropdownArrowSvg />
  </SvgWrapper>
)
