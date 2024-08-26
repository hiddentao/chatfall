import { type JWTPayload, SignJWT, jwtVerify } from "jose"
import { env } from "../env"

const alg = "HS256"
const secret = new TextEncoder().encode(env.ENC_KEY)

export type UserJwtPayload = JWTPayload & {
  id: number
  name: string
}

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
