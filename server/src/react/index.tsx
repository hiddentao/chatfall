/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import { hydrateRoot } from "react-dom/client"
import { App } from "./App.js"
import "./styles.css"

const envClient =
  typeof window !== "undefined" ? (window as any).__ENV || {} : {}
const serverUrl =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.host}`
    : ""

hydrateRoot(
  document,
  <App path="/" serverUrl={serverUrl} envClient={envClient} />,
)
