declare module "react-dom/server.browser" {
  import { ReactElement } from "react"
  export function renderToReadableStream(
    element: ReactElement,
    options: {
      bootstrapModules: string[]
    },
  ): Promise<ReadableStream>
}
