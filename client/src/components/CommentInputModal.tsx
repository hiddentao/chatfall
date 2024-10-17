import {
  ReactElement,
  cloneElement,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import { PropsWithClassname } from "../types"
import { cn } from "../utils/ui"
import { CloseButton } from "./CloseButton"
import {
  CommentInputForm,
  CommentInputFormProps,
  CommentInputFormRef,
} from "./CommentInputForm"

interface CommentInputModalProps
  extends PropsWithClassname,
    Omit<CommentInputFormProps, "onCommentPosted"> {
  onCommentPosted?: () => void
  children?: ReactElement
}

export interface CommentInputModalRef {
  open: () => void
}

export const CommentInputModal = forwardRef<
  CommentInputModalRef,
  CommentInputModalProps
>(
  (
    { parentCommentId, onCommentPosted, className, children, ...formProps },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const commentInputFormRef = useRef<CommentInputFormRef>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleOpen = useCallback(() => {
      setIsOpen(true)
    }, [])

    const handleClose = useCallback(() => setIsOpen(false), [])

    const handleCommentPosted = useCallback(() => {
      handleClose()
      onCommentPosted?.()
    }, [handleClose, onCommentPosted])

    useEffect(() => {
      if (isOpen) {
        commentInputFormRef.current?.setFocused()
      }
    }, [isOpen])

    useImperativeHandle(ref, () => ({
      open: () => {
        handleOpen()
      },
    }))

    const triggerWithClick = useMemo(
      () =>
        children
          ? cloneElement(children, {
              onClick: handleOpen,
            })
          : null,
      [children, handleOpen],
    )

    return (
      <div className={className} ref={containerRef}>
        {triggerWithClick || (
          <div onClick={handleOpen}>
            <CommentInputForm
              parentCommentId={parentCommentId}
              onCommentPosted={handleCommentPosted}
              showMinified={true}
              {...formProps}
            />
          </div>
        )}
        <dialog
          id="comment_modal"
          className={cn("modal", { "modal-open": isOpen })}
        >
          <div className="modal-box rounded-md w-full sm:max-w-[600px] p-0 overflow-y-scroll max-h-[80vh]">
            <CommentInputForm
              ref={commentInputFormRef}
              parentCommentId={parentCommentId}
              onCommentPosted={handleCommentPosted}
              className="pt-6"
              {...formProps}
            />
            <CloseButton onClick={handleClose} />
          </div>
          <div className="modal-backdrop" onClick={handleClose} />
        </dialog>
      </div>
    )
  },
)

CommentInputModal.displayName = "CommentInputModal"
