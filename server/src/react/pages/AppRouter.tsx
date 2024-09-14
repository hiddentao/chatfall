import { type Config, LoginEmailForm, LogoutSvg } from "@chatfall/client"
import { Button } from "@chatfall/client"
import { type FC, useEffect, useMemo, useState } from "react"
import { BrowserRouter, Link, Route, Routes } from "react-router-dom"
import { StaticRouter } from "react-router-dom/server"
import { useGlobalContext } from "../contexts/global"
import { Home } from "./Home"

const AppRoutes = () => (
  <>
    <nav>
      <Link to="/">Dashboard</Link>
      <Link to="/blocked-emails">Blocked Emails</Link>
      <Link to="/blocked-domains">Blocked Domains</Link>
      <Link to="/blocked-words">Blocked Words</Link>
      <Link to="/flagged-words">Flagged Words</Link>
      <Link to="/comments">Comments</Link>
    </nav>
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/blocked-emails" element={<BlockedEmails />} />
      <Route path="/blocked-domains" element={<BlockedDomains />} />
      <Route path="/blocked-words" element={<BlockedWords />} />
      <Route path="/flagged-words" element={<FlaggedWords />} />
      <Route path="/comments" element={<Comments />} /> */}
    </Routes>
  </>
)

export const AppRouter: FC<{ path: string; config: Config }> = ({
  path,
  config,
}) => {
  const { store } = useGlobalContext()
  const { checkingAuth, loggedInUser, hasAdmin, logout } = store.useStore()
  const [creatingAdmin, setCreatingAdmin] = useState(false)

  const onEmailVerified = () => {
    console.log("Email verified")
  }

  useEffect(() => {
    ;(async () => {
      setCreatingAdmin(!(await hasAdmin()))
    })()
  }, [hasAdmin])

  const Router = useMemo(
    () => (typeof window !== "undefined" ? BrowserRouter : StaticRouter),
    [],
  )

  return (
    <div className="w-full h-full">
      <div className="flex flex-row  p-2 justify-between items-center bg-info text-info-content">
        <a href="/" className="flex-0">
          <h1 className="text-2xl font-heading">
            Chatfall Admin
            <strong className=" block text-xs text-info-content/50">
              {config.server}
            </strong>
          </h1>
        </a>
        {loggedInUser && (
          <div className="text-right flex items-center">
            <span className="mr-4">{loggedInUser.name}</span>
            <Button
              onClick={logout}
              variant="icon"
              title="Logout"
              tooltipClassName="tooltip-left tooltip-bottom"
              className="w-6 h-6"
            >
              <LogoutSvg />
            </Button>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col items-center justify-center mt-2 px-4 py-8">
        {checkingAuth ? (
          <div className={"flex flex-row justify-center items-center w-full"}>
            <div className="skeleton h-32 w-1/2" />
          </div>
        ) : (
          <>
            {loggedInUser ? (
              <Router location={path}>
                <AppRoutes />
              </Router>
            ) : (
              <div className="flex flex-col items-center justify-center">
                {creatingAdmin ? (
                  <p className="bg-info text-info-content mb-4">
                    Since you are the first user to sign up, you will become the
                    administrator of this Chatfall instance!
                  </p>
                ) : null}
                <LoginEmailForm
                  adminOnly={true}
                  onEmailVerified={onEmailVerified}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
