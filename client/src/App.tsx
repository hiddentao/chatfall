import { FC } from "react"
import { CommentList } from "./components/CommentList"
import "./global.css"
import { GlobalProvider } from "./contexts/global"
import { createStore } from "./store/client"
import { Config, ThemeMode, ThemeNames } from "./types"
import { updateCSSVariables } from "./utils/ui"

export const createApp = (config: Config) => {
  const store = createStore(config)

  // override theme variables
  if (config.darkThemeOverride?.colors) {
    updateCSSVariables(
      ThemeNames[ThemeMode.Dark],
      config.darkThemeOverride.colors,
    )
  }
  if (config.lightThemeOverride?.colors) {
    updateCSSVariables(
      ThemeNames[ThemeMode.Light],
      config.lightThemeOverride.colors,
    )
  }

  // set light/dark mode theme
  const useDarkMode =
    config.mode === ThemeMode.Dark ||
    (config.mode === undefined &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.dataset.theme = useDarkMode
    ? ThemeNames[ThemeMode.Dark]
    : ThemeNames[ThemeMode.Light]

  const App: FC = () => {
    return (
      <GlobalProvider store={store} config={config}>
        <CommentList />
      </GlobalProvider>
    )
  }

  return App
}
