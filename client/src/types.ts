import { Sort } from "@chatfall/server"

export const LightTheme = "cLight"
export const DarkTheme = "cDark"

export enum ThemeMode {
  Light = "light",
  Dark = "dark",
}

/**
 * Chatfall client-side configuration.
 */
export type Config = {
  // URL of the comments server
  server: string
  // Title of the comments section, default is "Comments"
  title?: string
  // Fix the theme mode (i.e. disable auto light/dark mode detection based on the user's system preferences)
  mode?: ThemeMode
  // Initial sort-mode, default is newest first
  initialSort?: Sort
}

export type PropsWithClassname = {
  className?: string
}
