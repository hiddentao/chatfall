import { FC } from "react"
import { Button } from "./Button"
import { DarkSvg, LightSvg } from "./Svg"

export const ThemeSwitcher: FC = () => {
  return (
    <div>
      <Button
        data-set-theme="cLight"
        variant="iconMeta"
        className="theme-light-button"
        tooltipClassName="tooltip-bottom tooltip-left"
        title="Switch to light theme"
      >
        <LightSvg />
      </Button>
      <Button
        data-set-theme="cDark"
        variant="iconMeta"
        className="theme-dark-button"
        tooltipClassName="tooltip-bottom tooltip-left"
        title="Switch to dark theme"
      >
        <DarkSvg />
      </Button>
    </div>
  )
}
