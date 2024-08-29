import normalizeUrl from "normalize-url"

export const generateUsernameFromEmail = (email: string) => {
  const [prefix, domain] = email.split("@")
  const p = `${prefix.charAt(0)}***${prefix.charAt(prefix.length - 1)}`
  const d = `${domain.charAt(0)}***${domain.charAt(domain.length - 1)}`
  return `${p}@${d}`
}

export const generateCanonicalUrl = (url: string) => {
  return normalizeUrl(url)
}
