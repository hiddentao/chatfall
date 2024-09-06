import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))

export const formatPlural = (
  count: number,
  singular: string,
  plural: string,
) => (count === 1 ? singular : plural)
