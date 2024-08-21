import { FC, useCallback, useState } from "react"
import isEmail from "validator/es/lib/isEmail"
import { useGlobalContext } from "../contexts/global"
import { useField, useForm } from "../hooks/form"
import { PropsWithClassname } from "../types"
import { cn } from "../utils/ui"
import { Button } from "./Button"
import { ErrorBox } from "./ErrorBox"
import { TextAreaInput, TextInput, standardInputStyle } from "./Form"
import { Loading } from "./Loading"

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

type VerifyEmailFormProps = PropsWithClassname & {
  blob: string
  onVerified: () => void
}

const VerifyEmailForm: FC<VerifyEmailFormProps> = ({
  className,
  blob,
  onVerified,
}) => {
  const { store } = useGlobalContext()
  const { verifyEmail } = store.useStore()

  const [code] = [
    useField({
      name: "code",
      initialValue: "",
    }),
  ]

  const { valid, reset } = useForm({
    fields: [code],
  })

  const [error, setError] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      try {
        setIsSubmitting(true)
        setError("")
        await verifyEmail(blob, code.value)
        reset()
        onVerified()
      } catch (err: any) {
        setError(err.toString())
      } finally {
        setIsSubmitting(false)
      }
    },
    [blob, code.value, verifyEmail],
  )

  const onHideError = useCallback(() => {
    setError("")
  }, [])

  return (
    <form className={className} onSubmit={handleSubmit}>
      <p className="mb-4">
        We have sent a verification code to your email address. Please enter it
        below.
      </p>
      <TextInput
        label="Verification code"
        field={code}
        className="mt-8"
        inputClassname={cn(standardInputStyle, "max-w-full")}
        hideTooltip={true}
        hideError={true}
        maxChars={10}
        required={true}
        placeholder="Enter code..."
        hideValidationIndicator={true}
      />
      <Button
        disabled={!valid}
        inProgress={isSubmitting}
        className="mt-8 inline-block"
      >
        Verify
      </Button>
      {error && (
        <ErrorBox className="mt-2" hideError={onHideError}>
          {error}
        </ErrorBox>
      )}
    </form>
  )
}

export const CommentInputForm: FC<CommentInputFormProps> = ({ className }) => {
  const { store } = useGlobalContext()
  const { addComment, fetchComments, loginEmail } = store.useStore()
  const [focused, setFocused] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [isPosting, setIsPosting] = useState<boolean>(false)
  const [verifyEmailBlob, setVerifyEmailBlob] = useState<string>()
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false)

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

  const postComment = useCallback(
    async (comment: string) => {
      await addComment(comment)
      reset()
      fetchComments()
    },
    [addComment, fetchComments, reset],
  )

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      try {
        setIsPosting(true)
        setError("")
        if (email.value && !isEmailVerified) {
          setVerifyEmailBlob((await loginEmail(email.value)).blob)
        } else {
          await postComment(commentText.value)
        }
      } catch (err: any) {
        setError(err.toString())
      } finally {
        setIsPosting(false)
      }
    },
    [commentText, addComment, fetchComments],
  )

  const onEmailVerified = useCallback(async () => {
    setIsEmailVerified(true)

    try {
      setIsPosting(true)
      setError("")
      await postComment(commentText.value)
    } catch (err: any) {
      setError(err.toString())
    } finally {
      setIsPosting(false)
    }
  }, [addComment, commentText.value, fetchComments])

  const onFocusForm = useCallback(() => {
    setFocused(true)
  }, [])

  const onHideError = useCallback(() => {
    setError("")
  }, [])

  return (
    <div
      className={cn(
        "flex flex-col p-4 bg-yellow-100 border border-yellow-500 rounded-md max-h-14 transition-max-height duration-1000 ease-in-out overflow-hidden",
        {
          "max-h-96 overflow-y-scroll": focused,
        },
        className,
      )}
    >
      {verifyEmailBlob && !isEmailVerified ? (
        <VerifyEmailForm
          className="mt-4"
          blob={verifyEmailBlob}
          onVerified={onEmailVerified}
        />
      ) : (
        <form onSubmit={handleSubmit}>
          <TextAreaInput
            label={focused ? "Comment" : ""}
            field={commentText}
            hideError={true}
            required={true}
            placeholder="Add comment..."
            hideValidationIndicator={true}
            inputClassname={cn("w-full", {
              "bg-transparent border-0 italic": !focused,
              [standardInputStyle]: focused,
            })}
            extraInputProps={{
              onFocus: onFocusForm,
            }}
          />
          {focused ? (
            <div>
              <TextInput
                label="Email address"
                field={email}
                extraInputProps={{
                  type: "email",
                  size: 35,
                }}
                className={cn("mt-8", {
                  hidden: isEmailVerified,
                })}
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
                className="inline-block mt-8"
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
        </form>
      )}
    </div>
  )
}
