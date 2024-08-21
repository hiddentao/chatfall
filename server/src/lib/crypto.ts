import crypto from "crypto"
import type { LogInterface } from "./logger"

export interface CryptoParams {
  key: string
  iv: string
}

const _assertCryptoParams = (params: CryptoParams) => {
  if (params.key.length !== 32) {
    throw new Error("Key must be 32 chars")
  }
  if (params.iv.length !== 16) {
    throw new Error("IV must be 16 chars")
  }
}

export const decrypt = async (
  log: LogInterface,
  cryptoParams: CryptoParams,
  ciphertext: string,
) => {
  _assertCryptoParams(cryptoParams)

  const { key, iv } = cryptoParams

  log.debug(`Decrypting ciphertext ${ciphertext}`)

  const cipher = crypto.createDecipheriv("aes-256-cbc", key, iv)

  const plaintext =
    cipher.update(ciphertext, "hex", "utf8") + cipher.final("utf8")

  return JSON.parse(plaintext)[1]
}

export const encrypt = async (
  log: LogInterface,
  cryptoParams: CryptoParams,
  data: string,
) => {
  _assertCryptoParams(cryptoParams)

  const { key, iv } = cryptoParams

  log.debug(`Encrypting data ${data}`)

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv)

  const salt: string = await new Promise((resolve, reject) => {
    crypto.randomBytes(32, (err, buf) => {
      if (err) {
        reject(err)
      } else {
        resolve(buf.toString("hex"))
      }
    })
  })

  const plaindata = [
    salt.substring(0, salt.length / 2),
    data,
    salt.substring(salt.length / 2),
  ]

  return (
    cipher.update(JSON.stringify(plaindata), "utf8", "hex") +
    cipher.final("hex")
  )
}
