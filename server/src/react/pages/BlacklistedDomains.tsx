import { type FC } from "react"
import { Setting } from "../../settings/types"
import { BlacklistEditor } from "../components/BlacklistEditor"

const validateDomains = (value: string): string | undefined => {
  const domains = value.split("\n").filter((domain) => domain.trim() !== "")
  const domainRegex =
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i
  const invalidDomains = domains.filter(
    (domain) => !domainRegex.test(domain.trim()),
  )

  if (invalidDomains.length > 0) {
    return `Invalid domain(s): ${invalidDomains.join(", ")}`
  }
  return undefined
}

export const BlacklistedDomains: FC = () => {
  return (
    <BlacklistEditor
      title="Blacklisted domains"
      settingKey={Setting.BlacklistedDomains}
      validateItems={validateDomains}
      placeholder="Enter one domain per line (e.g., example.com)"
    >
      <ul className="list-disc ml-4">
        <li className="mb-2">
          New users will not be able to login or register using email addresses
          from these domains.
        </li>
        <li className="mb-2">
          Existing users with email addresses from these domains will be
          blacklisted. <strong>Note: This cannot be undone!</strong>
        </li>
        <li className="mb-2">
          Existing comments from blacklisted users will remain visible.
        </li>
      </ul>
    </BlacklistEditor>
  )
}
