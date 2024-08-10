import { FC, useCallback, useState } from "react"
import TextareaAutoresize from "react-textarea-autosize"
import { useStoreContext } from "../contexts/store"
import { PropsWithClassname } from "../types"
import { cn } from "../utils/ui"
import { Button } from "./Button"
import { ErrorBox } from "./ErrorBox"

export type CommentInputFormProps = PropsWithClassname & {}

export const CommentInputForm: FC<CommentInputFormProps> = ({ className }) => {
  const { store } = useStoreContext()
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
      <div className="flex flex-col mx-4 p-4 bg-pal2 border border-gray-400 rounded-md">
        <TextareaAutoresize
          minRows={1}
          disabled={isPosting}
          placeholder="Add comment..."
          className={cn(
            "bg-transparent border-b border-b-transparent focus:border-b-gray-700 focus:outline-none",
            {
              "border-b-gray-700": input.length,
              "text-gray-400": isPosting,
            },
          )}
          onChange={onInputChange}
          onFocus={onFocusInput}
          onBlur={onBlurInput}
          value={input}
        />
        <div
          className="mt-3"
          style={{
            display: inputInFocus ? "block" : "none",
          }}
        >
          <Button inProgress={isPosting} className="inline-block">
            Submit
          </Button>
        </div>
        {error && (
          <ErrorBox className="mt-2" hideError={onHideError}>
            {error}
          </ErrorBox>
        )}
      </div>
    </form>
  )
}
