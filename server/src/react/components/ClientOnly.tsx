import React, { useState, useEffect, type PropsWithChildren } from "react"

const ClientOnly: React.FC<PropsWithChildren> = ({ children }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient ? <>{children}</> : null
}

export default ClientOnly
