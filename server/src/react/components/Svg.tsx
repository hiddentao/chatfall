import { type PropsWithClassname, Svg } from "@chatfall/client"
import { type FC, type ReactNode, useEffect, useState } from "react"

const SvgWrapper = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return children
}

export const LogoutSvg: FC<PropsWithClassname> = ({ className }) => (
  <SvgWrapper>
    <Svg.LogoutSvg className={className} />
  </SvgWrapper>
)
export const DarkSvg: FC<PropsWithClassname> = ({ className }) => (
  <SvgWrapper>
    <Svg.DarkSvg className={className} />
  </SvgWrapper>
)
export const LightSvg: FC<PropsWithClassname> = ({ className }) => (
  <SvgWrapper>
    <Svg.LightSvg className={className} />
  </SvgWrapper>
)

export const DropdownArrowSvg: FC<PropsWithClassname> = ({ className }) => (
  <SvgWrapper>
    <Svg.DropdownArrowSvg className={className} />
  </SvgWrapper>
)

export const InfoSvg: FC<PropsWithClassname> = ({ className }) => (
  <SvgWrapper>
    <Svg.InfoSvg className={className} />
  </SvgWrapper>
)

export const DeleteSvg: FC<PropsWithClassname> = ({ className }) => (
  <SvgWrapper>
    <Svg.DeleteSvg className={className} />
  </SvgWrapper>
)
