import { PostCommentResponse } from "@chatfall/server"
import React, { FC, useCallback, useState } from "react"
import isEmail from "validator/es/lib/isEmail"
import { useGlobalContext } from "../contexts/global"
import { useField, useForm } from "../hooks/form"
import { PropsWithClassname } from "../types"
import { cn } from "../utils/ui"
import { Button } from "./Button"
import { ErrorBox } from "./ErrorBox"
import { TextAreaInput, TextInput, standardInputStyle } from "./Form"
import { WarningSvg } from "./Svg"

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
  onCancelVerification: () => void
}

const VerifyEmailForm: FC<VerifyEmailFormProps> = ({
  className,
  blob,
  onVerified,
  onCancelVerification,
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
    [blob, code.value, onVerified, reset, verifyEmail],
  )

  const onCancelVerifyEmailCode = useCallback(() => {
    setError("")
    onCancelVerification()
  }, [onCancelVerification])

  const onHideError = useCallback(() => {
    setError("")
  }, [])

  return (
    <form className={className} onSubmit={handleSubmit}>
      <p className="mb-4">
        Please enter the verification code we just sent to your email address:
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
        disabled={isSubmitting}
        placeholder="Enter code..."
        hideValidationIndicator={true}
      />
      <div className="mt-8 flex flex-row justify-start items-center">
        <Button
          disabled={!valid}
          inProgress={isSubmitting}
          className="ml-2 inline-block"
        >
          Verify
        </Button>
        <Button
          variant="link"
          className="inline-block ml-2 text-xs"
          title="Cancel and back"
          onClick={onCancelVerifyEmailCode}
        >
          Cancel
        </Button>
      </div>
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
  const { loggedInUser, addComment, loginEmail, logout } = store.useStore()
  const [focused, setFocused] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [isPosting, setIsPosting] = useState<boolean>(false)
  const [responseAfterPosting, setResponseAfterPosting] =
    useState<PostCommentResponse>()
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
      const response = await addComment(comment)
      setResponseAfterPosting(response)
    },
    [addComment],
  )

  const setupForFreshComment = useCallback(() => {
    reset()
    setVerifyEmailBlob(undefined)
    setResponseAfterPosting(undefined)
  }, [reset])

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
      commentText.value,
      email.value,
      loginEmail,
      loggedInUser,
      postComment,
      reset,
    ],
  )

  const onCancelEmailVerification = useCallback(() => {
    setVerifyEmailBlob(undefined)
  }, [])

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
    [logout],
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
          onCancelVerification={onCancelEmailVerification}
        />
      ) : responseAfterPosting ? (
        <div>
          <p className="flex flex-row justify-start items-center">
            {responseAfterPosting.alert ? (
              <WarningSvg className="w-4 h-4 mr-2" />
            ) : null}
            {responseAfterPosting.message}
          </p>
          <Button className="mt-4" onClick={setupForFreshComment}>
            Continue
          </Button>
        </div>
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
                disabled={!!isPosting}
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
