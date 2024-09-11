import { LoginEmailForm } from "@chatfall/client"
import { useGlobalContext } from "@chatfall/client"
import React, { useState, useEffect } from "react"

const Home: React.FC = () => {
  const { store } = useGlobalContext()
  const { loggedInUser, hasAdmin } = store.useStore()
  const [creatingAdmin, setCreatingAdmin] = useState(false)

  const handleLoginComplete = () => {
    console.log("Login completed")
  }

  useEffect(() => {
    ;(async () => {
      setCreatingAdmin(!(await hasAdmin()))
    })()
  }, [hasAdmin])

  return (
    <div>
      <h1>Welcome to Chatfall!</h1>
      {loggedInUser ? (
        <p>Hello, {loggedInUser.name}!</p>
      ) : (
        <>
          {creatingAdmin ? (
            <p className="bg-info text-info-content">
              Since you are the first user to sign up, you will become the
              administrator of this Chatfall instance!
            </p>
          ) : null}
          <LoginEmailForm
            adminOnly={true}
            onEmailVerified={handleLoginComplete}
          />
        </>
      )}
    </div>
  )
}

export default Home
