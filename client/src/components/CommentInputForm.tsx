import { FC, useCallback, useEffect, useState } from "react"
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
  const { loggedInUser, addComment, fetchComments, loginEmail, logout } =
    store.useStore()
  const [focused, setFocused] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [isPosting, setIsPosting] = useState<boolean>(false)
  const [verifyEmailBlob, setVerifyEmailBlob] = useState<string>()

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
    isValidFn: (fields, formError) => {
      if (formError) {
        return false
      }
      return fields.reduce((m: boolean, f) => {
        if (f.name === "email" && loggedInUser) {
          return m
        } else {
          return m && f.valid && f.isSet
        }
      }, true)
    },
  })

  const postComment = useCallback(
    async (comment: string) => {
      await addComment(comment)
      reset()
    },
    [addComment, fetchComments, reset],
  )

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      try {
        setIsPosting(true)
        setError("")
        if (email.value && !loggedInUser) {
          setVerifyEmailBlob((await loginEmail(email.value)).blob)
        } else {
          await postComment(commentText.value)
          reset()
        }
      } catch (err: any) {
        setError(err.toString())
      } finally {
        setIsPosting(false)
      }
    },
    [
      addComment,
      commentText.value,
      email.value,
      fetchComments,
      loginEmail,
      loggedInUser,
      postComment,
      reset,
    ],
  )

  const onEmailVerified = useCallback(async () => {
    try {
      setIsPosting(true)
      setError("")
      await postComment(commentText.value)
    } catch (err: any) {
      setError(err.toString())
    } finally {
      setIsPosting(false)
    }
  }, [commentText.value, postComment])

  const onClickLogout = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      logout()
    },
    [],
  )

  const onFocusForm = useCallback(() => {
    setFocused(true)
  }, [])

  const onHideError = useCallback(() => {
    setError("")
  }, [])

  return (
    <div
      className={cn(
        "flex flex-col p-4 bg-yellow-100 border border-yellow-500 rounded-md max-h-14 transition-max-height duration-1000 ease-in-out overflow-hidden relative",
        {
          "max-h-96 overflow-y-scroll": focused,
        },
        className,
      )}
    >
      {loggedInUser && focused ? (
        <p className="text-xs italic absolute top-2 right-2">
          Logged in as: <strong>{loggedInUser.name}</strong>
          <Button
            variant="link"
            className="ml-2 italic"
            title="Logout"
            onClick={onClickLogout}
          >
            (logout)
          </Button>
        </p>
      ) : null}
      {verifyEmailBlob && !loggedInUser ? (
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
            onFocus={onFocusForm}
            disabled={!!isPosting}
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
                  hidden: !!loggedInUser,
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
