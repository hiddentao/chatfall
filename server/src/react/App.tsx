import { useState } from "react"
import { BrowserRouter, Link, Route, Routes } from "react-router-dom"
import { StaticRouter } from "react-router-dom/server"

const Home = () => {
  const [count, setCount] = useState(0)
  return (
    <>
      <h1>Counter {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </>
  )
}

const About = () => <h1>About Page</h1>

const AppRoutes = () => (
  <>
    <nav>
      <Link to="/">Home</Link> | <Link to="/about">About</Link>
    </nav>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </>
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
