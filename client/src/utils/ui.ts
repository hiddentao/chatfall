import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ThemeConfig } from "../types"

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))

export const formatPlural = (
  count: number,
  singular: string,
  plural: string,
) => (count === 1 ? singular : plural)

export const updateCSSVariables = (
  theme: string,
  updates: Partial<ThemeConfig["colors"]>,
): void => {
  // Find all stylesheets
  for (let i = 0; i < document.styleSheets.length; i++) {
    let sheet = document.styleSheets[i]

    // Look through all the rules in each stylesheet
    for (let j = 0; j < sheet.cssRules.length; j++) {
      let rule = sheet.cssRules[j]

      // Check if this rule matches our theme
      if (
        rule instanceof CSSStyleRule &&
        rule.selectorText === `[data-theme="${theme}"]`
      ) {
        Object.entries(updates).forEach(([key, value]) => {
          if (value !== undefined) {
            const cssVarName =
              colorsToCSSVars[key as keyof ThemeConfig["colors"]]
            if (cssVarName) {
              console.log(
                `Overriding ${theme} theme variable ${cssVarName} to ${value}`,
              )
              rule.style.setProperty(cssVarName, `from ${value} l c h`)
            }
          }
        })
        return // Exit after updating
      }
    }
  }
}

// Mapping of ThemeConfig color names to CSS variable names
const colorsToCSSVars: Record<keyof ThemeConfig["colors"], string> = {
  "base-100": "--b1",
  "base-content": "--bc",
  "base-200": "--b2",
  "base-300": "--b3",
  primary: "--p",
  "primary-content": "--pc",
  secondary: "--s",
  "secondary-content": "--sc",
  neutral: "--n",
  "neutral-content": "--nc",
  info: "--in",
  "info-content": "--inc",
  error: "--er",
  "error-content": "--erc",
}
