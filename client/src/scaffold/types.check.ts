// Compile-time check that the hand-written public types in
// `types/chatfall.d.ts` match the source types. If they drift apart, `tsc -b`
// (run by the client build) fails on one of the lines below.
import type { Sort } from "@chatfall/server"
import type * as Public from "../../types/chatfall"
import type { Config, ThemeConfig, ThemeMode } from "../types"
import type { Chatfall } from "./index"

// The function types must be written out here: wrapping them in a helper
// type makes the check miss differences in optional fields.
// biome-ignore format: keep the parentheses so the comparison stays readable
type Equals<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type Expect<T extends true> = T
type Flatten<T> = { [K in keyof T]: T[K] }

// The bundle does not export the enums, so the public types use their values.
type SourceConfig = Flatten<
  Omit<Config, "mode" | "initialSort"> & {
    mode?: `${ThemeMode}`
    initialSort?: `${Sort}`
  }
>

export type PublicTypeChecks = [
  Expect<Equals<Public.ChatfallSort, `${Sort}`>>,
  Expect<Equals<Public.ChatfallThemeMode, `${ThemeMode}`>>,
  Expect<Equals<Public.ChatfallThemeConfig, ThemeConfig>>,
  Expect<Equals<Flatten<Public.ChatfallConfig>, SourceConfig>>,
  Expect<Equals<Parameters<typeof Chatfall.init>[0], Config>>,
  Expect<Equals<keyof typeof Public.Chatfall, keyof typeof Chatfall>>,
]
