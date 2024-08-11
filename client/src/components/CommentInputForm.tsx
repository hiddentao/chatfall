import { FC, useCallback, useState } from "react"
import TextareaAutoresize from "react-textarea-autosize"
import { useGlobalContext } from "../contexts/global"
import { PropsWithClassname } from "../types"
import { cn } from "../utils/ui"
import { Button } from "./Button"
import { ErrorBox } from "./ErrorBox"

export type CommentInputFormProps = PropsWithClassname & {}

export const CommentInputForm: FC<CommentInputFormProps> = ({ className }) => {
  const { store } = useGlobalContext()
  const { addComment, fetchComments } = store.useStore()

  const [input, setInput] = useState<string>("")
  const [inputInFocus, setInputInFocus] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [isPosting, setIsPosting] = useState<boolean>(false)

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      try {
        setIsPosting(true)
        setError("")
        await addComment(input)
        fetchComments()
      } catch (err: any) {
        setError(err.toString())
      } finally {
        setIsPosting(false)
      }
    },
    [input, addComment, fetchComments],
  )

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setError("")
      setInput(event.target.value)
    },
    [],
  )

  const onFocusInput = useCallback(() => {
    setInputInFocus(true)
  }, [])

  const onBlurInput = useCallback(() => {
    if (input.trim() === "") {
      setInputInFocus(false)
    }
  }, [input])

  const onHideError = useCallback(() => {
    setError("")
  }, [])

  return (
    <form className={className} onSubmit={handleSubmit}>
      <div className="cf-flex cf-flex-col cf-p-4 cf-bg-yellow-100 cf-border cf-border-yellow-500 cf-rounded-md">
        <TextareaAutoresize
          minRows={1}
          disabled={isPosting}
          placeholder="Add comment..."
          className={cn(
            "cf-bg-transparent cf-border-b cf-border-b-transparent focus:cf-border-b-gray-700 focus:cf-outline-none",
            {
              "cf-border-b-gray-700": input.length,
              "cf-text-gray-400": isPosting,
            },
          )}
          onChange={onInputChange}
          onFocus={onFocusInput}
          onBlur={onBlurInput}
          value={input}
        />
        <div
          className="cf-mt-3"
          style={{
            display: inputInFocus ? "block" : "none",
          }}
        >
          <Button inProgress={isPosting} className="cf-inline-block">
            Submit
          </Button>
        </div>
        {error && (
          <ErrorBox className="cf-mt-2" hideError={onHideError}>
            {error}
          </ErrorBox>
        )}
      </div>
    </form>
  )
}
