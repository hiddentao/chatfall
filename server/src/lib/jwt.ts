import { type JWTPayload, SignJWT, jwtVerify } from "jose"
import { env } from "../env"
import type { LoggedInUser } from "../types"

const alg = "HS256"
const secret = new TextEncoder().encode(env.ENC_KEY)

export type UserJwtPayload = JWTPayload & LoggedInUser

export const signJwt = async (payload: UserJwtPayload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("90d")
    .sign(secret)
}

export const verifyJwt = async (token: string): Promise<UserJwtPayload> => {
  return (
    await jwtVerify(token, secret, {
      algorithms: [alg],
    })
  ).payload as UserJwtPayload
}
