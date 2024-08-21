import { ReactNode, useCallback } from "react"
import TextareaAutoresize from "react-textarea-autosize"
import { FieldApi } from "../hooks/form"
import { cn } from "../utils/ui"
import { Loading } from "./Loading"

export const FieldError = ({
  error,
  className,
}: { error?: string; className?: string }) => {
  return error ? (
    <em
      className={cn(
        "block px-1 bg-red-500 text-white font-bold mt-2 rounded-md break-all",
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
}: { field: FieldApi; hideValidationIndicator?: boolean }) => {
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
  required,
}: FieldLabelProps & { children?: ReactNode }) => {
  const dummyOnClick = useCallback((e: any) => {
    e.preventDefault()
  }, [])

  return label ? (
    <label
      className={cn(
        "flex flex-row justify-between items-end mb-1 text-slate-600",
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
  inputClassname?: string
  field: FieldApi
  hideTooltip?: boolean
  hideError?: boolean
}

export const FieldCharLimitIndicator = ({
  field,
  charLimit,
}: { field: FieldApi; charLimit?: number }) => {
  return charLimit ? (
    <span className="text-red italic ml-2">
      {field.value.length}/{charLimit}
    </span>
  ) : null
}

export interface TextFieldProps extends FieldProps {
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
  props: TextFieldProps & { extraInputProps?: any },
) => {
  const {
    field,
    className,
    inputClassname,
    maxChars,
    hideError,
    placeholder,
    extraInputProps,
    hideValidationIndicator,
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
        <input
          className={inputClassname}
          maxLength={maxChars}
          name={field.name}
          value={field.value}
          onChange={onInputChange}
          placeholder={placeholder}
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

export const TextAreaInput = (
  props: TextFieldProps & { extraInputProps?: any },
) => {
  const {
    field,
    className,
    inputClassname,
    hideError,
    placeholder,
    extraInputProps,
    hideValidationIndicator,
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
          minRows={1}
          placeholder={placeholder}
          className={inputClassname}
          onChange={onInputChange}
          value={field.value}
          {...extraInputProps}
        />
        <FieldSuffix
          field={field}
          hideValidationIndicator={hideValidationIndicator}
        />
      </div>
      {hideError ? null : <FieldError {...field} />}
    </div>
  )
}
