import React, { useState, useEffect, ReactNode } from "react"

interface ClientOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

export const ClientOnly: React.FC<ClientOnlyProps> = ({
  children,
  fallback = null,
}) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient ? <>{children}</> : <>{fallback}</>
}
