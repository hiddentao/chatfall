import { PostCommentResponse } from "@chatfall/server"
import React, {
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react"
import { useGlobalContext } from "../contexts/global"
import { useField, useForm } from "../hooks/form"
import { type ClientStore } from "../store/client"
import { cn } from "../utils/ui"
import { Button } from "./Button"
import { ErrorBox } from "./ErrorBox"
import { FormDiv, TextAreaInput, standardInputStyle } from "./Form"
import { ButtonWithLogin } from "./Login"
import { WarningSvg } from "./Svg"

export type CommentInputFormProps = {
  className?: string
  showMinified?: boolean
  parentCommentId?: number
  commentFieldPlaceholder?: string
  commentFieldTitle?: string
  onCommentPosted?: () => void
}

export type CommentInputFormRef = {
  setFocused: () => void
}

const validateCommentText = (value: string) => {
  if (value.trim() === "") {
    return "Comment cannot be empty"
  }
}

export const CommentInputForm = forwardRef<
  CommentInputFormRef,
  CommentInputFormProps
>(
  (
    {
      showMinified,
      parentCommentId,
      className,
      commentFieldPlaceholder,
      onCommentPosted,
    },
    ref,
  ) => {
    const { store } = useGlobalContext<ClientStore>()
    const { loggedInUser, addComment, logout } = store.useStore()
    const [error, setError] = useState<string>("")
    const [isPosting, setIsPosting] = useState<boolean>(false)
    const [responseAfterPosting, setResponseAfterPosting] =
      useState<PostCommentResponse>()

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useImperativeHandle(ref, () => ({
      setFocused: () => {
        textareaRef.current?.focus()
      },
    }))

    const [commentText] = [
      useField({
        name: "commentText",
        initialValue: "",
        validate: validateCommentText,
      }),
    ]

    const { valid, reset } = useForm({
      fields: [commentText],
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
        const response = await addComment(comment, parentCommentId)
        setResponseAfterPosting(response)
      },
      [addComment, parentCommentId],
    )

    const handleSubmit = useCallback(
      async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        try {
          setIsPosting(true)
          setError("")
          await postComment(commentText.value!)
          reset()
        } catch (err: any) {
          setError(err.toString())
        } finally {
          setIsPosting(false)
        }
      },
      [commentText.value, postComment, reset],
    )

    const handleContinue = useCallback(() => {
      reset()
      setResponseAfterPosting(undefined)
      onCommentPosted?.()
    }, [onCommentPosted, reset])

    const onClickLogout = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        logout()
      },
      [logout],
    )

    const onHideError = useCallback(() => {
      setError("")
    }, [])

    return (
      <FormDiv
        className={cn("max-h-full p-4", className, {
          "max-h-14": showMinified,
        })}
      >
        {responseAfterPosting ? (
          <div>
            <p className="flex flex-row justify-start items-center">
              {responseAfterPosting.alert ? (
                <WarningSvg className="w-4 h-4 mr-2" />
              ) : null}
              {responseAfterPosting.message}
            </p>
            <Button className="mt-4" onClick={handleContinue}>
              Continue
            </Button>
          </div>
        ) : (
          <form className="flex flex-col">
            <TextAreaInput
              tabIndex={1}
              field={commentText}
              hideError={true}
              required={true}
              rows={showMinified ? 1 : 8}
              placeholder={commentFieldPlaceholder || "Add comment..."}
              hideValidationIndicator={true}
              inputClassName={cn("self-stretch w-full", {
                "bg-transparent border-0 italic p-0 min-h-1 pointer-events-none":
                  showMinified,
                [standardInputStyle]: !showMinified,
              })}
              disabled={!!isPosting}
              ref={textareaRef}
            />
            {loggedInUser && !showMinified ? (
              <div className="text-xs italic flex flex-col items-center sm:flex-row mt-2">
                <p>
                  Logged in as: <strong>{loggedInUser.name}</strong>
                </p>
                <Button
                  variant="link"
                  className="sm:ml-2 italic"
                  title="Logout"
                  onClick={onClickLogout}
                >
                  (logout)
                </Button>
              </div>
            ) : null}
            {!showMinified ? (
              <div>
                <ButtonWithLogin
                  tabIndex={2}
                  disabled={!valid}
                  inProgress={isPosting}
                  className="inline-block mt-6"
                  type="submit"
                  onClick={handleSubmit}
                >
                  {loggedInUser ? "Submit" : "Login and submit"}
                </ButtonWithLogin>
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
  },
)

CommentInputForm.displayName = "CommentInputForm"
