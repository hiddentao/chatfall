import { type Static, type TSchema, Type } from "@sinclair/typebox"
import { Value } from "@sinclair/typebox/value"
import { LogLevel } from "./lib/logger/types"

function parseEnv<T extends TSchema>(schema: T, env: unknown): Static<T> {
  const converted = Value.Convert(schema, Value.Default(schema, env))
  const isValid = Value.Check(schema, converted)
  if (!isValid) {
    const errors = Value.Errors(schema, converted)
    throw new Error(
      `Invalid environment variables: ${[...errors]
        .map((e) => `${e.path}: ${e.message}`)
        .join(", ")}`,
    )
  }

  return converted
}

const EnvDTO = Type.Object({
  NODE_ENV: Type.Enum(
    {
      development: "development",
      production: "production",
    },
    { default: "development" },
  ),
  PORT: Type.Number({ default: 3000 }),
  HOSTNAME: Type.String({ default: "localhost" }),
  DATABASE_URL: Type.String(),
  MAILGUN_API_KEY: Type.Optional(Type.String({ default: "" })),
  MAILGUN_SENDER: Type.Optional(Type.String({ default: "" })),
  LOG_LEVEL: Type.Enum(LogLevel, { default: "info" }),
  ENC_KEY: Type.String({ minLength: 48 }),
})

export const isProd = process.env.NODE_ENV === "production"
export const env = parseEnv(EnvDTO, process.env)
