import Elysia, { t, type Static } from "elysia"
import { verifyJwt } from "../lib/jwt"
import type { LogInterface } from "../lib/logger"
import type { GlobalContext } from "../types"
import { generateCanonicalUrl } from "../utils/string"
import { SocketEvent } from "./types"

export const createSocket = (ctx: GlobalContext) => {
  const log = ctx.log.create("ws")

  return new Elysia().ws("/ws", {
    body: t.Object({
      type: t.Literal("register"),
      url: t.String(),
      jwtToken: t.Optional(t.String()),
    }),
    response: SocketEvent,
    close(ws) {
      log.debug(`Client disconnected: ${ws.id} - ${ws.remoteAddress}`)
      ctx.sockets.deregister(ws.id)
    },
    message(ws, message) {
      const { type, url, jwtToken } = message
      ;(async () => {
        if (type === "register") {
          const canonicalUrl = generateCanonicalUrl(url)

          log.debug(`Client connected: ${ws.id} - ${ws.remoteAddress}`)
          ctx.sockets.registerUser(ws, ws.id, canonicalUrl)

          // deciper user id from jwt token
          if (jwtToken) {
            try {
              const { id } = await verifyJwt(jwtToken)

              if (id) {
                ctx.sockets.registerUser(ws, ws.id, canonicalUrl, id)
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

export class SocketClients {
  mapClientIdToSocket: Record<string, any> = {}
  mapUserIdToClientId: Record<number, string> = {}
  mapClientIdToUserId: Record<string, number> = {}
}

export class SocketManager {
  log: LogInterface
  mapPostToSocketClients: Record<string, SocketClients> = {}

  constructor(log: LogInterface) {
    this.log = log
  }

  public registerUser(
    socket: any,
    clientId: string,
    canonicalUrl: string,
    userId?: number,
  ) {
    this.log.debug(`Client registered for post ${canonicalUrl}: ${clientId}`)

    if (!this.mapPostToSocketClients[canonicalUrl]) {
      this.mapPostToSocketClients[canonicalUrl] = new SocketClients()
    }

    const s = this.mapPostToSocketClients[canonicalUrl]

    s.mapClientIdToSocket[clientId] = socket
    s.mapClientIdToSocket[clientId]
    if (userId) {
      s.mapUserIdToClientId[userId] = socket.id
      s.mapClientIdToUserId[socket.id] = userId
    }
  }

  public broadcast(canonicalUrl: string, event: Static<typeof SocketEvent>) {
    if (this.mapPostToSocketClients[canonicalUrl]) {
      const s = this.mapPostToSocketClients[canonicalUrl]

      for (const id in s.mapClientIdToSocket) {
        s.mapClientIdToSocket[id].send(event)
      }
    }
  }

  public deregister(clientId: string) {
    this.log.debug(`Client deregistered: ${clientId}`)

    for (let canonicalUrl in this.mapPostToSocketClients) {
      const s = this.mapPostToSocketClients[canonicalUrl]
      if (s.mapClientIdToSocket[clientId]) {
        delete s.mapClientIdToSocket[clientId]
        if (s.mapClientIdToUserId[clientId]) {
          const userId = s.mapClientIdToUserId[clientId]
          delete s.mapClientIdToUserId[clientId]
          delete s.mapUserIdToClientId[userId]
        }
      }
    }
  }
}
