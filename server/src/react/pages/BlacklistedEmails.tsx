import {
  Button,
  FieldError,
  TextAreaInput,
  useField,
  useForm,
  useGlobalContext,
} from "@chatfall/client"
import { type FC, useCallback, useState } from "react"
import { Setting } from "../../settings/types"
import type { ServerStore } from "../store/server"
import { PageWrapper } from "./PageWrapper"

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
  const { store } = useGlobalContext<ServerStore>()
  const { settings, setSetting } = store.useStore()
  const [inProgress, setInProgress] = useState(false)

  const blockedEmailsField = useField<string>({
    name: "blockedEmails",
    initialValue:
      settings?.[Setting.BlacklistedEmails].join("\n") || ("" as string),
    validate: validateEmails,
  })

  const form = useForm({
    fields: [blockedEmailsField],
  })

  const handleSave = useCallback(async () => {
    if (form.valid) {
      setInProgress(true)
      try {
        const emails = blockedEmailsField
          .value!.split("\n")
          .filter((e) => e.trim() !== "")
        await setSetting(Setting.BlacklistedEmails, emails)
      } finally {
        setInProgress(false)
      }
    }
  }, [form.valid, blockedEmailsField.value, setSetting])

  return (
    <PageWrapper title="Blacklisted emails">
      <div className="card card-compact bg-base-300 w-full md:max-w-[600px] shadow-xl mb-8">
        <div className="card-body p-4">
          <ul className="list-disc ml-4">
            <li className="mb-2">
              New users will not be able to login or register using these email
              addresses.
            </li>
            <li className="mb-2">
              Existing users will be blacklisted.{" "}
              <strong>Note: This cannot be undone!</strong>
            </li>
            <li className="mb-2">
              Existing comments from blacklisted users will remain visible.
            </li>
          </ul>
        </div>
      </div>
      <TextAreaInput
        field={blockedEmailsField}
        label="Blacklisted Email Addresses"
        placeholder="Enter one email address per line"
        rows={10}
        className="w-full md:max-w-[500px] mb-4"
        inputClassname="p-2 border rounded-md w-full"
        hideValidationIndicator={true}
      />
      <FieldError error={form.formError} />
      <Button
        onClick={handleSave}
        disabled={!form.valid}
        inProgress={inProgress}
      >
        Save
      </Button>
    </PageWrapper>
  )
}
