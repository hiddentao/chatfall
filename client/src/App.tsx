import { FC } from "react"
import { CommentList } from "./components/CommentList"
import "./global.css"
import { GlobalProvider } from "./contexts/global"
import { createStore } from "./shared/comments.store"
import { Config, ThemeMode } from "./types"
import { updateCSSVariables } from "./utils/ui"

const LightThemeName = "cLight"
const DarkThemeName = "cDark"

export const createApp = (config: Config) => {
  const store = createStore(config)

  // override theme variables
  if (config.darkThemeOverride?.colors) {
    updateCSSVariables(DarkThemeName, config.darkThemeOverride.colors)
  }
  if (config.lightThemeOverride?.colors) {
    updateCSSVariables(LightThemeName, config.lightThemeOverride.colors)
  }

  // set light/dark mode theme
  const useDarkMode =
    config.mode === ThemeMode.Dark ||
    (config.mode === undefined &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.dataset.theme = useDarkMode
    ? DarkThemeName
    : LightThemeName

  const App: FC = () => {
    return (
      <GlobalProvider store={store} config={config}>
        <CommentList />
      </GlobalProvider>
    )
  }

  return App
}
