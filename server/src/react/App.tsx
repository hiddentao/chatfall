import { useState } from "react"

export const App = () => {
  const [count, setCount] = useState(0)
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
function checkForRebuild () {
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
        <h1>Counter {count}</h1>
        <button onClick={() => setCount(count + 1)}>Increment</button>
      </body>
    </html>
  )
}
