import { type FC } from "react"
import { Setting } from "../../settings/types"
import { BlacklistEditor } from "../components/BlacklistEditor"

const validateEmails = (value: string): string | undefined => {
  const emails = value.split("\n").filter((email) => email.trim() !== "")
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const invalidEmails = emails.filter((email) => !emailRegex.test(email.trim()))

  if (invalidEmails.length > 0) {
    return `Invalid email(s): ${invalidEmails.join(", ")}`
  }
  return undefined
}

export const BlacklistedEmails: FC = () => {
  return (
    <BlacklistEditor
      title="Blacklisted emails"
      settingKey={Setting.BlacklistedEmails}
      validateItems={validateEmails}
      placeholder="Enter one email address per line (e.g., user@example.com)"
    >
      <ul className="list-disc ml-4">
        <li className="mb-2">
          New users will not be able to login or register using these email
          addresses.
        </li>
        <li className="mb-2">
          Existing users with these email addresses will be blacklisted.{" "}
          <strong>Note: This cannot be undone!</strong>
        </li>
        <li className="mb-2">
          Existing comments from blacklisted users will remain visible.
        </li>
      </ul>
    </BlacklistEditor>
  )
}
