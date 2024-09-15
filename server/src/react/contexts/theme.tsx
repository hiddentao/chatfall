import { ThemeMode } from "@chatfall/client"
import {
  type FC,
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

export interface ThemeContextValue {
  themeMode: ThemeMode
  toggleTheme: () => void
}

export const ThemeContext = createContext({} as ThemeContextValue)

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(ThemeMode.Light)

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setThemeMode(ThemeMode.Dark)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    const newThemeMode =
      themeMode === ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark
    setThemeMode(newThemeMode)
  }, [themeMode])

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const ThemeConsumer = ThemeContext.Consumer

export const useThemeContext = () => {
  return useContext(ThemeContext)
}
