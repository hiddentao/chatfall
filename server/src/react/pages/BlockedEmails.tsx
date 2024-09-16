import {
  Button,
  FieldError,
  FormDiv,
  TextAreaInput,
  useField,
  useForm,
  useGlobalContext,
} from "@chatfall/client"
import { type FC, useCallback, useState } from "react"
import { Setting } from "../../settings/types"
import type { ServerStore } from "../store/server"

const validateEmails = (value: string): string | undefined => {
  const emails = value.split("\n").filter((email) => email.trim() !== "")
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const invalidEmails = emails.filter((email) => !emailRegex.test(email.trim()))

  if (invalidEmails.length > 0) {
    return `Invalid email(s): ${invalidEmails.join(", ")}`
  }
  return undefined
}

export const BlockedEmails: FC = () => {
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
    <>
      <p className="mt-6 mb-4 text-3xl">
        Users with these email addresses will not be able to post comments.
      </p>
      <FormDiv className="mt-4 p-4 w-full md:max-w-[800px]">
        <TextAreaInput
          field={blockedEmailsField}
          label="Blocked Email Addresses"
          placeholder="Enter one email address per line"
          rows={10}
          className="mb-4"
          inputClassname="w-full p-2 border rounded"
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
      </FormDiv>
    </>
  )
}
