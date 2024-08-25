import Elysia, { t } from "elysia"
import { verifyJwt } from "../lib/jwt"
import type { GlobalContext, JwtTokenPayload } from "../types"
import { SocketEvent } from "./types"

export const createSocket = (ctx: GlobalContext) => {
  const log = ctx.log.create("ws")

  return new Elysia().ws("/ws", {
    body: t.Object({
      type: t.Literal("register"),
      jwtToken: t.Optional(t.String()),
    }),
    response: SocketEvent,
    message(ws, message) {
      const { type, jwtToken } = message
      ;(async () => {
        if (type === "register") {
          log.debug(`Client connected: ${ws.id} - ${ws.remoteAddress}`)
          ctx.sockets[ws.id] = ws

          // deciper user id from jwt token
          let userId: number | undefined
          if (jwtToken) {
            try {
              const { id } = await verifyJwt<JwtTokenPayload>(jwtToken)

              if (id) {
                log.debug(`Client identified: ${ws.id} - user ${id}`)
                ctx.userSockets[id] = ws.id
              }
            } catch (err) {
              log.error(`Error verifying JWT token`, err)
            }
          }
        }
      })()
    },
  })
}
