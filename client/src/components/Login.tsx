import React, { FC, PropsWithChildren, useCallback, useState } from "react"
import { isEmail } from "validator"
import { useGlobalContext } from "../contexts/global"
import { useField, useForm } from "../hooks/form"
import { PropsWithClassname } from "../types"
import { cn } from "../utils/ui"
import { Button, ButtonProps } from "./Button"
import { ErrorBox } from "./ErrorBox"
import { FormDiv, TextInput, standardInputStyle } from "./Form"
import { CrossSvg } from "./Svg"

export const validateEmail = (value: string) => {
  if (!isEmail(value)) {
    return "Must be an email address"
  }
}

type VerifyEmailFormProps = PropsWithClassname & {
  blob: string
  onVerified: () => void
  onCancelVerification: () => void
}

export const VerifyEmailForm: FC<VerifyEmailFormProps> = ({
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
    async (event?: React.MouseEvent<HTMLButtonElement>) => {
      event?.preventDefault()
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
    <div className={className}>
      <p className="mb-4">
        Please enter the verification code we just sent to your email address:
      </p>
      <TextInput
        label="Verification code"
        field={code}
        inputClassname={cn(standardInputStyle, "max-w-full")}
        hideTooltip={true}
        hideError={true}
        maxChars={10}
        required={true}
        disabled={isSubmitting}
        placeholder="Enter code..."
        hideValidationIndicator={true}
        onEnterPress={() => handleSubmit()}
      />
      <div className="mt-6 flex flex-row justify-start items-center">
        <Button
          disabled={!valid}
          inProgress={isSubmitting}
          className="inline-block"
          onClick={handleSubmit}
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
    </div>
  )
}

export const EmailTextInput: FC<
  PropsWithClassname & {
    isDisabled?: boolean
    field: ReturnType<typeof useField>
    onEnterPress?: () => void
  }
> = ({ isDisabled, field, className, onEnterPress }) => {
  return (
    <TextInput
      label="Email address"
      disabled={!!isDisabled}
      field={field}
      extraInputProps={{
        type: "email",
        size: 35,
      }}
      onEnterPress={onEnterPress}
      className={className}
      inputClassname={cn(standardInputStyle, "max-w-full")}
      hideTooltip={true}
      hideError={true}
      maxChars={64}
      required={true}
      placeholder="Email address..."
      hideValidationIndicator={true}
    />
  )
}

export const LoginEmailForm: FC<
  PropsWithClassname & { onEmailVerified: () => void }
> = ({ onEmailVerified, className }) => {
  const { store } = useGlobalContext()
  const { loginEmail } = store.useStore()

  const [email] = [
    useField({
      name: "email",
      initialValue: "",
      validate: validateEmail,
    }),
  ]

  const { valid, reset } = useForm({
    fields: [email],
  })

  const [error, setError] = useState<string>("")
  const [verifyEmailBlob, setVerifyEmailBlob] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleSubmit = useCallback(
    (event?: React.MouseEvent<HTMLButtonElement>) => {
      event?.preventDefault()
      ;(async () => {
        try {
          setIsSubmitting(true)
          setError("")
          setVerifyEmailBlob((await loginEmail(email.value)).blob)
          reset()
        } catch (err: any) {
          setError(err.toString())
        } finally {
          setIsSubmitting(false)
        }
      })()
    },
    [email.value, loginEmail, reset],
  )

  const onCancelEmailVerification = useCallback(() => {
    setVerifyEmailBlob(undefined)
  }, [])

  const onHideError = useCallback(() => {
    setError("")
  }, [])

  return verifyEmailBlob ? (
    <VerifyEmailForm
      blob={verifyEmailBlob}
      onVerified={onEmailVerified}
      onCancelVerification={onCancelEmailVerification}
    />
  ) : (
    <div className={className}>
      <EmailTextInput
        field={email}
        isDisabled={isSubmitting}
        onEnterPress={() => handleSubmit()}
      />
      <Button
        disabled={!valid}
        inProgress={isSubmitting}
        className="inline-block mt-6"
        onClick={handleSubmit}
      >
        Submit
      </Button>
      {error && (
        <ErrorBox className="mt-2" hideError={onHideError}>
          {error}
        </ErrorBox>
      )}
    </div>
  )
}

export const LoginForm: FC<
  PropsWithChildren<
    PropsWithClassname & {
      showForm?: boolean
      onLoginComplete: () => void
    }
  >
> = ({ children, className, showForm, onLoginComplete }) => {
  return (
    <FormDiv
      className={cn(
        "max-h-0 overflow-hidden bg-slate-200 border-slate-700",
        {
          "max-h-72 p-4 border overflow-visible": showForm,
        },
        className,
      )}
    >
      <LoginEmailForm onEmailVerified={onLoginComplete} />
      {children}
    </FormDiv>
  )
}

export const ButtonWithLogin: FC<ButtonProps> = ({ className, ...props }) => {
  const { store } = useGlobalContext()
  const { loggedInUser } = store.useStore()

  const [showLoginForm, setShowLoginForm] = useState<boolean>(false)
  const [formIteration, setFormIteration] = useState<number>(0)
  const [loginPromiseResolver, setLoginPromiseResolver] = useState<() => void>()

  const login = useCallback(async () => {
    setShowLoginForm(true)
    setFormIteration((v) => v + 1)
    return new Promise((resolve) => {
      setLoginPromiseResolver(() => () => {
        resolve()
        setShowLoginForm(false)
        setLoginPromiseResolver(undefined)
      })
    }) as Promise<void>
  }, [])

  const closeLoginForm = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      setShowLoginForm(false)
    },
    [],
  )

  const onLoginComplete = useCallback(() => {
    if (loginPromiseResolver) {
      loginPromiseResolver()
    }
  }, [loginPromiseResolver])

  const onClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault()
      try {
        if (!loggedInUser && !showLoginForm) {
          await login()
        }
        props.onClick?.(event)
      } catch (err: any) {
        console.error(err)
      }
    },
    [loggedInUser, login, props.onClick, showLoginForm],
  )

  const btn = <Button className={cn(className)} {...props} onClick={onClick} />

  return (
    <div
      className={cn("dropdown", {
        "dropdown-open": showLoginForm,
      })}
    >
      {btn}
      <div className="dropdown-content card card-compact rounded-box z-[1] w-72 shadow">
        <LoginForm
          key={formIteration}
          showForm={showLoginForm}
          onLoginComplete={onLoginComplete}
          className="relative"
        >
          <Button
            variant="iconMeta"
            className="w-4 h-4 p-1 absolute top-1 right-1"
            onClick={closeLoginForm}
          >
            <CrossSvg />
          </Button>
        </LoginForm>
      </div>
    </div>
  )
}
