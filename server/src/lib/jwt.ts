import { type JWTPayload, SignJWT, jwtVerify } from "jose"
import { env } from "../env"

const alg = "HS256"
const secret = new TextEncoder().encode(env.ENC_KEY)

export const signJwt = async <T extends JWTPayload>(payload: T) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("90d")
    .sign(secret)
}

export const verifyJwt = async <T>(token: string): Promise<T> => {
  return (
    await jwtVerify(token, secret, {
      algorithms: [alg],
    })
  ).payload as T
}
