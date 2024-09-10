import React from "react"
import ReactDOM from "react-dom/client"
import { createApp } from "../App"
import { Config } from "../types"

export type ChatfallProps = Config & {
  rootElement: HTMLElement
}

export const Chatfall = {
  init: (props: ChatfallProps) => {
    ;['rootElement', 'server'].forEach((key) => {
      if (!(props as any)[key]) {
        throw new Error(`Config '${key}' is required`)
      }
    })

    const App = createApp(props)

    ReactDOM.createRoot(props.rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  },
}
