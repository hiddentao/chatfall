"use client"

import useDocusaurusContext from "@docusaurus/useDocusaurusContext"

function useVersion() {
  const { siteConfig } = useDocusaurusContext()
  return siteConfig.customFields.version as string
}

// Release tags and Docker image tags use the "v" prefix, NPM versions do not
export function Version({ prefix = "v" }: { prefix?: string }) {
  return `${prefix}${useVersion()}`
}

export function CdnLink({ file }: { file: string }) {
  const url = `https://cdn.jsdelivr.net/npm/@chatfall/client@${useVersion()}/dist/${file}`
  return <a href={url}>{url}</a>
}
