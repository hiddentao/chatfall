import React from "react"
import ReactDOM from "react-dom/client"
import { createApp } from "../App"
import { Config } from "../types"

export type ChatfallProps = Config & {
  rootElement: HTMLElement
}

export const Chatfall = {
  init: (props: ChatfallProps) => {
    if (!props.serverUrl) {
      throw new Error("serverUrl is required")
    }

    const App = createApp({
      ...props,
      pageUrl: props.pageUrl || window.location.href,
    })

    ReactDOM.createRoot(props.rootElement || document.body).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
  },
}
