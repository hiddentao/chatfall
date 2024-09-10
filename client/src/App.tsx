import { FC, useEffect } from "react"
import { CommentList } from "./components/CommentList"
import "./global.css"
import { GlobalProvider } from "./contexts/global"
import { createStore } from "./shared/comments.store"
import { Config, DarkTheme, LightTheme, ThemeMode } from "./types"

export const createApp = (config: Config) => {
  const store = createStore(config)

  const App: FC = () => {
    useEffect(() => {
      const useDarkMode = (config.mode === ThemeMode.Dark) || (config.mode === undefined && window.matchMedia("(prefers-color-scheme: dark)").matches)
      document.documentElement.dataset.theme = useDarkMode ? DarkTheme : LightTheme;
    }, [config.mode])

    return (
      <GlobalProvider store={store} config={config}>
        <CommentList />
      </GlobalProvider>
    )
  }

  return App
}
