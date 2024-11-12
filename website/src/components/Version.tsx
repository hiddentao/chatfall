"use client"

import useDocusaurusContext from "@docusaurus/useDocusaurusContext"

export function Version() {
  const { siteConfig } = useDocusaurusContext()
  return siteConfig.customFields.version as string
}
