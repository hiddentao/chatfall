import Elysia, { t } from "elysia"
import type { GlobalContext } from "../types"
import { SocketEvent, SocketEventTypeEnum } from "./types"

export const createSocket = (ctx: GlobalContext) => {
  return new Elysia().ws("/ws", {
    response: SocketEvent,
    message(ws) {
      console.log("received message")

      const d = {
        type: SocketEventTypeEnum.NewComment,
        user: {
          id: 1,
          username: "user1",
        },
        data: {
          id: 1,
          body: "hello",
          depth: 0,
          path: "1",
          createdAt: new Date().toISOString(),
        },
      }

      ws.send(d)
    },
  })
}
