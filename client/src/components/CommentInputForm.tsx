import { FC, useCallback, useState } from "react"
import isEmail from "validator/es/lib/isEmail"
import { useGlobalContext } from "../contexts/global"
import { useField, useForm } from "../hooks/form"
import { PropsWithClassname } from "../types"
import { cn } from "../utils/ui"
import { Button } from "./Button"
import { ErrorBox } from "./ErrorBox"
import { TextAreaInput, TextInput, standardInputStyle } from "./Form"

export type CommentInputFormProps = PropsWithClassname & {}

const validateCommentText = (value: string) => {
  if (value.trim() === "") {
    return "Comment cannot be empty"
  }
}

const validateEmail = (value: string) => {
  if (!isEmail(value)) {
    return "Must be an email address"
  }
}

export const CommentInputForm: FC<CommentInputFormProps> = ({ className }) => {
  const { store } = useGlobalContext()
  const { addComment, fetchComments } = store.useStore()

  const [commentText, email] = [
    useField({
      name: "commentText",
      initialValue: "",
      validate: validateCommentText,
    }),
    useField({
      name: "email",
      initialValue: "",
      validate: validateEmail,
    }),
  ]

  const { valid, reset } = useForm({
    fields: [commentText, email],
  })

  const [focused, setFocused] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [isPosting, setIsPosting] = useState<boolean>(false)

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      try {
        setIsPosting(true)
        setError("")
        await addComment(commentText.value)
        reset()
        fetchComments()
      } catch (err: any) {
        setError(err.toString())
      } finally {
        setIsPosting(false)
      }
    },
    [commentText, addComment, fetchComments],
  )

  const onFocusForm = useCallback(() => {
    setFocused(true)
  }, [])

  const onHideError = useCallback(() => {
    setError("")
  }, [])

  return (
    <form className={className} onSubmit={handleSubmit}>
      <div className="flex flex-col p-4 bg-yellow-100 border border-yellow-500 rounded-md">
        <TextAreaInput
          field={commentText}
          hideError={true}
          required={true}
          placeholder="Add comment..."
          hideValidationIndicator={true}
          inputClassname={cn("w-full", {
            "bg-transparent border-0 italic": !focused,
            standardInputStyle: focused,
          })}
          extraInputProps={{
            onFocus: onFocusForm,
          }}
        />
        {focused ? (
          <div>
            <TextInput
              label="Email"
              field={email}
              extraInputProps={{
                type: "email",
                size: 35,
              }}
              className="mt-8"
              inputClassname={cn(standardInputStyle, "max-w-full")}
              hideTooltip={true}
              hideError={true}
              maxChars={64}
              required={true}
              placeholder="Email address..."
              hideValidationIndicator={true}
            />
            <Button
              disabled={!valid}
              inProgress={isPosting}
              className="mt-8 inline-block"
            >
              Submit
            </Button>
            {error && (
              <ErrorBox className="mt-2" hideError={onHideError}>
                {error}
              </ErrorBox>
            )}
          </div>
        ) : null}
      </div>
    </form>
  )
}
