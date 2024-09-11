import { LoginEmailForm } from "@chatfall/client"
import { useGlobalContext } from "@chatfall/client"
import React from "react"

const Home: React.FC = () => {
  const { store } = useGlobalContext()
  const { loggedInUser } = store.useStore()

  const handleLoginComplete = () => {
    console.log("Login completed")
  }

  return (
    <div>
      <h1>Welcome to Chatfall</h1>
      {loggedInUser ? (
        <p>Hello, {loggedInUser.name}!</p>
      ) : (
        <LoginEmailForm onEmailVerified={handleLoginComplete} />
      )}
    </div>
  )
}

export default Home
