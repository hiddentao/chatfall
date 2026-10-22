/**
 * Type definitions for the bundled widget (`dist/chatfall.es.js`).
 *
 * The bundle includes code from `@chatfall/server`, which is not published to
 * NPM, so these types are written by hand. `src/scaffold/types.check.ts` makes
 * the client build fail if they no longer match the source types.
 */

/**
 * Comment sort order: newest first (`nf`), oldest first (`of`), highest score
 * (`hs`), lowest score (`ls`), most replies (`mr`), least replies (`lr`).
 */
export type ChatfallSort = "nf" | "of" | "hs" | "ls" | "mr" | "lr"

export type ChatfallThemeMode = "light" | "dark"

export type ChatfallThemeConfig = {
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
export type ChatfallConfig = {
  // URL of the comments server
  serverUrl: string
  // URL of the page, default is the current URL
  pageUrl?: string
  // Root element to append comments to, default is document.body
  rootElement?: HTMLElement
  // Title of the comments section, default is "Comments"
  title?: string
  // Fix the theme mode (i.e. disable auto light/dark mode detection based on the user's system preferences)
  mode?: ChatfallThemeMode
  // Light theme overrides
  lightThemeOverride?: ChatfallThemeConfig
  // Dark theme overrides
  darkThemeOverride?: ChatfallThemeConfig
  // Initial sort-mode, default is newest first
  initialSort?: ChatfallSort
}

export declare const Chatfall: {
  init: (props: ChatfallConfig) => void
}
