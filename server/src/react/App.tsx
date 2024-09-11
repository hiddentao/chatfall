import { type Config, GlobalProvider, createStore } from "@chatfall/client"
import { useEffect, useMemo, useState } from "react"
import { BrowserRouter, Link, Route, Routes } from "react-router-dom"
import { StaticRouter } from "react-router-dom/server"
import Home from "./pages/Home"

const config: Config = {
  server: "http://localhost:3000",
}

const AppRoutes = () => (
  <GlobalProvider store={createStore(config)} config={config}>
    <nav>
      <Link to="/">Home</Link>
    </nav>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  </GlobalProvider>
)

export const App = ({ path }: { path: string }) => {
  const [themeName, setThemeName] = useState<string>("")

  const Router = useMemo(
    () => (typeof window === "undefined" ? StaticRouter : BrowserRouter),
    [],
  )

  useEffect(() => {
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    setThemeName(darkMode ? "cDark" : "cLight")
  }, [])

  return (
    <html data-theme={themeName}>
      <head>
        <meta charSet="utf-8" />
        <title>Chatfall admin</title>
        <meta name="description" content="Bun, Elysia & React" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/public/client.css" />
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
function checkForRebuild() {
  fetch('/public/rebuild-trigger.json?' + new Date().getTime())
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
      </head>
      <body>
        <Router location={path}>
          <AppRoutes />
        </Router>
      </body>
    </html>
  )
}
