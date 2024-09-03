import React, { FC, ReactNode, useCallback, useMemo, useState } from "react"
import { isEmail } from "validator"
import { useGlobalContext } from "../contexts/global"
import { useField, useForm } from "../hooks/form"
import { PropsWithClassname } from "../types"
import { cn } from "../utils/ui"
import { Button } from "./Button"
import { ErrorBox } from "./ErrorBox"
import { FormDiv, TextInput, standardInputStyle } from "./Form"

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
          className="inline-block"
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

export const EmailTextInput: FC<
  PropsWithClassname & {
    isDisabled?: boolean
    field: ReturnType<typeof useField>
  }
> = ({ isDisabled, field, className }) => {
  return (
    <TextInput
      label="Email address"
      disabled={!!isDisabled}
      field={field}
      extraInputProps={{
        type: "email",
        size: 35,
      }}
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
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
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
    <form onSubmit={handleSubmit} className={className}>
      <EmailTextInput field={email} isDisabled={isSubmitting} />
      <Button
        disabled={!valid}
        inProgress={isSubmitting}
        className="inline-block mt-8"
      >
        Submit
      </Button>
      {error && (
        <ErrorBox className="mt-2" hideError={onHideError}>
          {error}
        </ErrorBox>
      )}
    </form>
  )
}

export const LoginForm: FC<
  PropsWithClassname & {
    showForm?: boolean
    onLoginComplete: () => void
  }
> = ({ className, showForm, onLoginComplete }) => {
  return (
    <FormDiv
      className={cn(
        "max-h-0 mt-0",
        {
          "max-h-72 mt-4 p-4 border": showForm,
        },
        className,
      )}
    >
      <p className="mb-4">You need to login first.</p>
      <LoginEmailForm onEmailVerified={onLoginComplete} />
    </FormDiv>
  )
}

export type LoginWrapperChildProps = {
  login: () => Promise<void>
  showLoginForm: boolean
  renderedLoginForm: ReactNode
}

export type LoginWrapperChild = (props: LoginWrapperChildProps) => ReactNode

export const LoginWrapper: FC<{ children: LoginWrapperChild }> = ({
  children,
}) => {
  const { store } = useGlobalContext()
  const { loggedInUser } = store.useStore()

  const [showLoginForm, setShowLoginForm] = useState<boolean>(false)
  const [loginPromiseResolver, setLoginPromiseResolver] = useState<() => void>()

  const login = useCallback(async () => {
    if (loggedInUser) {
      return
    }
    setShowLoginForm(true)
    return new Promise((resolve) => {
      setLoginPromiseResolver(() => () => {
        resolve()
        setShowLoginForm(false)
        setLoginPromiseResolver(undefined)
      })
    }) as Promise<void>
  }, [loggedInUser])

  const onLoginComplete = useCallback(() => {
    if (loginPromiseResolver) {
      loginPromiseResolver()
    }
  }, [loginPromiseResolver])

  const renderedLoginForm = useMemo(() => {
    return loggedInUser ? null : (
      <LoginForm showForm={showLoginForm} onLoginComplete={onLoginComplete} />
    )
  }, [showLoginForm, onLoginComplete, loggedInUser])

  return children({ login, showLoginForm, renderedLoginForm })
}
