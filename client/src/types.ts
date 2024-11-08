import { Sort } from "@chatfall/server"

export enum ThemeMode {
  Light = "light",
  Dark = "dark",
}

export const ThemeNames: Record<ThemeMode, string> = {
  [ThemeMode.Light]: "cLight",
  [ThemeMode.Dark]: "cDark",
}

export type ThemeConfig = {
  /**
   * Theme colours.
   * @see https://daisyui.com/docs/themes/
   */
  colors: {
    "base-100": string
    "base-content": string
    "base-200": string
    "base-300": string
    primary: string
    "primary-content": string
    secondary: string
    "secondary-content": string
    neutral: string
    "neutral-content": string
    info: string
    "info-content": string
    error: string
    "error-content": string
  }
}

/**
 * Chatfall client-side configuration.
 */
export type Config = {
  // URL of the comments server
  serverUrl: string
  // URL of the page, default is the current URL
  pageUrl?: string
  // Root element to append comments to, default is document.body
  rootElement?: HTMLElement
  // Title of the comments section, default is "Comments"
  title?: string
  // Fix the theme mode (i.e. disable auto light/dark mode detection based on the user's system preferences)
  mode?: ThemeMode
  // Light theme overrides
  lightThemeOverride?: ThemeConfig
  // Dark theme overrides
  darkThemeOverride?: ThemeConfig
  // Initial sort-mode, default is newest first
  initialSort?: Sort
}

export type PropsWithClassname = {
  className?: string
}
