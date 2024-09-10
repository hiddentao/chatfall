import { Sort } from "@chatfall/server"

/**
 * Chatfall client-side configuration.
 */
export type Config = {
  // URL of the comments server
  server: string
  // Title of the comments section, default is "Comments"
  title?: string
  // Disable the light/dark theme mode switcher, default is false
  disableModeSwitcher?: boolean
  // Initial sort-mode, default is newest first
  initialSort?: Sort
}

export type PropsWithClassname = {
  className?: string
}
