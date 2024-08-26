import Elysia, { t, type Static } from "elysia"
import { verifyJwt } from "../lib/jwt"
import type { LogInterface } from "../lib/logger"
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
    close(ws) {
      ctx.sockets.deregister(ws.id)
    },
    message(ws, message) {
      const { type, jwtToken } = message
      ;(async () => {
        if (type === "register") {
          log.debug(`Client connected: ${ws.id} - ${ws.remoteAddress}`)
          ctx.sockets.registerUser(ws, ws.id)

          // deciper user id from jwt token
          let userId: number | undefined
          if (jwtToken) {
            try {
              const { id } = await verifyJwt(jwtToken)

              if (id) {
                log.debug(`Client identified: ${ws.id} - user ${id}`)
                ctx.sockets.registerUser(ws, ws.id, id)
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

export class SocketManager {
  log: LogInterface
  mapClientIdToSocket: Record<string, any> = {}
  mapUserIdToClientId: Record<number, string> = {}
  mapClientIdToUserId: Record<string, number> = {}

  constructor(log: LogInterface) {
    this.log = log
  }

  public registerUser(socket: any, clientId: string, userId?: number) {
    this.mapClientIdToSocket[clientId] = socket
    this.mapClientIdToSocket[clientId]
    if (userId) {
      this.mapUserIdToClientId[userId] = socket.id
      this.mapClientIdToUserId[socket.id] = userId
    }
  }

  public broadcast(event: Static<typeof SocketEvent>) {
    for (const id in this.mapClientIdToSocket) {
      this.mapClientIdToSocket[id].send(event)
    }
  }

  public deregister(clientId: string) {
    this.log.debug(`Client disconnected: ${clientId}`)
    delete this.mapClientIdToSocket[clientId]
    if (this.mapClientIdToUserId[clientId]) {
      const userId = this.mapClientIdToUserId[clientId]
      delete this.mapClientIdToUserId[clientId]
      delete this.mapUserIdToClientId[userId]
    }
  }
}
