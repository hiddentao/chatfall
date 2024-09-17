import {
  Button,
  FieldError,
  TextAreaInput,
  useField,
  useForm,
  useGlobalContext,
} from "@chatfall/client"
import { type FC, type ReactNode, useCallback, useState } from "react"
import { Setting } from "../../settings/types"
import type { ServerStore } from "../store/server"
import { PageWrapper } from "./PageWrapper"

interface BlacklistEditorProps {
  title: string
  settingKey: Setting
  validateItems: (value: string) => string | undefined
  placeholder: string
  children: ReactNode
}

export const BlacklistEditor: FC<BlacklistEditorProps> = ({
  title,
  settingKey,
  validateItems,
  placeholder,
  children,
}) => {
  const { store } = useGlobalContext<ServerStore>()
  const { settings, setSetting } = store.useStore()
  const [inProgress, setInProgress] = useState(false)

  const blockedItemsField = useField<string>({
    name: "blockedItems",
    initialValue: (settings?.[settingKey] as string[]).join("\n") || "",
    validate: validateItems,
  })

  const form = useForm({
    fields: [blockedItemsField],
  })

  const handleSave = useCallback(async () => {
    if (form.valid) {
      setInProgress(true)
      try {
        const items = blockedItemsField
          .value!.split("\n")
          .filter((item) => item.trim() !== "")
        await setSetting(settingKey, items)
      } finally {
        setInProgress(false)
      }
    }
  }, [form.valid, blockedItemsField.value, setSetting, settingKey])

  return (
    <PageWrapper title={title}>
      <div className="card card-compact bg-base-300 w-full md:max-w-[600px] shadow-xl mb-8">
        <div className="card-body p-4">{children}</div>
      </div>
      <TextAreaInput
        field={blockedItemsField}
        label={title}
        placeholder={placeholder}
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
