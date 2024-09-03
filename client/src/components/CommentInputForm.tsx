import { PostCommentResponse } from "@chatfall/server"
import React, { FC, useCallback, useState } from "react"
import { useGlobalContext } from "../contexts/global"
import { useField, useForm } from "../hooks/form"
import { PropsWithClassname } from "../types"
import { cn } from "../utils/ui"
import { Button } from "./Button"
import { ErrorBox } from "./ErrorBox"
import { FormDiv, TextAreaInput, standardInputStyle } from "./Form"
import { EmailTextInput, VerifyEmailForm, validateEmail } from "./Login"
import { WarningSvg } from "./Svg"

export type CommentInputFormProps = PropsWithClassname & {}

const validateCommentText = (value: string) => {
  if (value.trim() === "") {
    return "Comment cannot be empty"
  }
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
    <FormDiv
      className={cn(
        "max-h-14 p-4 border",
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
              <EmailTextInput
                field={email}
                className={cn("mt-8", {
                  hidden: !!loggedInUser,
                })}
                isDisabled={!!isPosting}
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
    </FormDiv>
  )
}
