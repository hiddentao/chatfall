"use client"

import { type Config, GlobalProvider, ThemeNames } from "@chatfall/client"
import { useMemo } from "react"
import {} from "react-router-dom"
import { ThemeConsumer, ThemeProvider } from "./contexts/theme"
import { AppRouter } from "./pages/AppRouter"
import { createStore } from "./store/server"

export const App = ({
  path,
  serverUrl,
}: { path: string; serverUrl?: string }) => {
  const config = useMemo(
    () => ({
      serverUrl:
        serverUrl ?? `${window.location.protocol}//${window.location.host}`,
      pageUrl: typeof window !== "undefined" ? window.location.href : "",
    }),
    [serverUrl],
  ) as Config & { serverUrl: string; pageUrl: string }

  return (
    <GlobalProvider store={createStore(config)} config={config}>
      <ThemeProvider>
        <ThemeConsumer>
          {({ themeMode }) => (
            <html data-theme={ThemeNames[themeMode]}>
              <head>
                <meta charSet="utf-8" />
                <title>Chatfall admin</title>
                <meta name="description" content="Bun, Elysia & React" />
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1"
                />
                <link rel="stylesheet" href="/frontend.css" />
                {
                  <script
                    type="text/javascript"
                    dangerouslySetInnerHTML={{
                      __html: `
function checkForRebuild() {
fetch('/rebuild-trigger.json?' + new Date().getTime())
  .then(response => response.json())
  .then(data => {
    if (window.lastRebuildTimestamp && window.lastRebuildTimestamp !== data.timestamp) {
      location.reload();
    }
    window.lastRebuildTimestamp = data.timestamp;
  })
  .catch(console.error);
}
setInterval(checkForRebuild, 2000);
          `,
                    }}
                  />
                }
              </head>
              <body>
                <AppRouter path={path} config={config} />
              </body>
            </html>
          )}
        </ThemeConsumer>
      </ThemeProvider>
    </GlobalProvider>
  )
}
