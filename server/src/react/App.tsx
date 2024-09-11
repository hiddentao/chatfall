import { type Config, GlobalProvider, createStore } from "@chatfall/client"
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
  const Router = typeof window === "undefined" ? StaticRouter : BrowserRouter

  return (
    <html>
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
setInterval(checkForRebuild, 100);
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
