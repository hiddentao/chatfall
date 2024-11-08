import React, {
  forwardRef,
  PropsWithChildren,
  ReactNode,
  Ref,
  useCallback,
} from "react"
import TextareaAutoresize from "react-textarea-autosize"
import { FieldApi } from "../hooks/form"
import { PropsWithClassname } from "../types"
import { cn } from "../utils/ui"
import { Loading } from "./Loading"

export const FormDiv = forwardRef<
  HTMLDivElement,
  PropsWithChildren<PropsWithClassname>
>(({ children, className }, ref: Ref<HTMLDivElement>) => {
  return (
    <div
      ref={ref}
      className={cn(
        className,
        "flex flex-col bg-secondary text-secondary-content rounded-md relative overflow-visible",
      )}
    >
      {children}
    </div>
  )
})

export const FieldError = ({
  error,
  className,
}: { error?: string; className?: string }) => {
  return error ? (
    <em
      className={cn(
        "block px-1 bg-error border border-error text-error-content font-bold mt-2 rounded-md break-all",
        className,
      )}
    >
      {error}
    </em>
  ) : null
}

export const FieldSuffix = ({
  field,
  hideValidationIndicator,
}: { field: FieldApi<any>; hideValidationIndicator?: boolean }) => {
  return (
    <>
      {field.isValidating && !hideValidationIndicator ? (
        <Loading className="inline-block ml-2" />
      ) : null}
    </>
  )
}

export interface FieldLabelProps {
  help?: string
  label?: string
  required?: boolean
}

export const FieldLabel = ({
  children,
  label,
}: FieldLabelProps & { children?: ReactNode }) => {
  const dummyOnClick = useCallback((e: any) => {
    e.preventDefault()
  }, [])

  return label ? (
    <label
      className={cn(
        "flex flex-row justify-between items-end mb-1 text-base-content",
      )}
      onClick={dummyOnClick}
    >
      <span className="flex flex-row text-xs">{label}</span>
      {children}
    </label>
  ) : null
}

export interface FieldProps extends FieldLabelProps {
  className?: string
  inputClassName?: string
  field: FieldApi<any>
  hideTooltip?: boolean
  hideError?: boolean
}

export const FieldCharLimitIndicator = ({
  field,
  charLimit,
}: { field: FieldApi<any>; charLimit?: number }) => {
  return charLimit ? (
    <span className="text-red italic ml-2">
      {field.value.length}/{charLimit}
    </span>
  ) : null
}

export interface TextFieldProps extends FieldProps {
  tabIndex?: number
  disabled?: boolean
  maxChars?: number
  showCharCount?: boolean
  placeholder?: string
  labelRight?: ReactNode
  hideValidationIndicator?: boolean
}

export const standardInputStyle =
  "bg-white focus:ring-0 focus:outline-none text-black border border-gray-300 p-2 relative placeholder-opacity-50 placeholder-gray-400"

const TextFieldLabel = (props: TextFieldProps) => {
  const { field, maxChars, showCharCount, labelRight } = props

  return (
    <FieldLabel {...props}>
      {labelRight ||
        (showCharCount ? (
          <FieldCharLimitIndicator field={field} charLimit={maxChars} />
        ) : null)}
    </FieldLabel>
  )
}

export const TextInput = (
  props: TextFieldProps & { onEnterPress?: () => void; extraInputProps?: any },
) => {
  const {
    field,
    className,
    inputClassName,
    maxChars,
    hideError,
    placeholder,
    disabled,
    extraInputProps,
    hideValidationIndicator,
    onEnterPress,
    tabIndex,
  } = props

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      field.handleChange(event.target.value)
    },
    [field],
  )

  const onKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && onEnterPress) {
        event.preventDefault()
        onEnterPress()
      }
    },
    [onEnterPress],
  )

  return (
    <div className={className}>
      <TextFieldLabel {...props} />
      <div className="flex flex-row justify-start items-center">
        <input
          tabIndex={tabIndex}
          className={cn("input input-bordered", inputClassName)}
          maxLength={maxChars}
          name={field.name}
          value={field.value}
          onChange={onInputChange}
          placeholder={placeholder}
          disabled={disabled}
          onKeyUp={onKeyUp}
          {...extraInputProps}
        ></input>
        <FieldSuffix
          field={field}
          hideValidationIndicator={hideValidationIndicator}
        />
      </div>
      {hideError ? null : <FieldError {...field} />}
    </div>
  )
}

export const TextAreaInput = forwardRef<
  HTMLTextAreaElement,
  TextFieldProps & {
    onFocus?: () => void
    rows?: number
  }
>((props, ref) => {
  const {
    field,
    className,
    inputClassName,
    hideError,
    placeholder,
    onFocus,
    disabled,
    rows = 4,
    hideValidationIndicator,
    tabIndex,
  } = props

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      field.handleChange(event.target.value)
    },
    [field],
  )

  return (
    <div className={className}>
      <TextFieldLabel {...props} />
      <div className="flex flex-row justify-start items-center">
        <TextareaAutoresize
          ref={ref}
          tabIndex={tabIndex}
          minRows={rows}
          placeholder={placeholder}
          className={cn("textarea textarea-bordered", inputClassName)}
          onChange={onInputChange}
          value={field.value}
          onFocus={onFocus}
          disabled={disabled}
        />
        <FieldSuffix
          field={field}
          hideValidationIndicator={hideValidationIndicator}
        />
      </div>
      {hideError ? null : <FieldError {...field} />}
    </div>
  )
})
