import {
  type Config,
  LoginEmailForm,
  ThemeMode,
  useGlobalContext,
} from "@chatfall/client"
import { Button } from "@chatfall/client"
import {
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { BrowserRouter, Link, Route, Routes } from "react-router-dom"
import { StaticRouter } from "react-router-dom/server"
import { DarkSvg, LightSvg, LogoutSvg } from "../components/Svg"
import { useThemeContext } from "../contexts/theme"
import { type ServerStore } from "../store/server"
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
  const { store } = useGlobalContext<ServerStore>()
  const { themeMode, toggleTheme } = useThemeContext()
  const [modeSwitcherBtn, setModeSwitcherBtn] = useState<ReactNode | null>(null)
  const {
    settings,
    checkingAuth,
    loggedInUser,
    hasAdmin,
    loadSettings,
    logout,
  } = store.useStore()
  const [creatingAdmin, setCreatingAdmin] = useState(false)

  const onEmailVerified = useCallback(async () => {
    // do nothing
  }, [])

  // load settings if user is logged in and settings are not loaded
  useEffect(() => {
    if (loggedInUser && !settings) {
      ;(async () => {
        try {
          await loadSettings()
        } catch (error) {
          console.error(error)
        }
      })()
    }
  }, [loadSettings, loggedInUser, settings])

  useEffect(() => {
    ;(async () => {
      setCreatingAdmin(!(await hasAdmin()))
    })()
  }, [hasAdmin])

  const Router = useMemo(
    () => (typeof window !== "undefined" ? BrowserRouter : StaticRouter),
    [],
  )

  useEffect(() => {
    setModeSwitcherBtn(
      <Button
        onClick={toggleTheme}
        variant="icon"
        title={
          themeMode === ThemeMode.Dark
            ? "Switch to Light Mode"
            : "Switch to Dark Mode"
        }
        tooltipClassName="tooltip-left tooltip-bottom"
        className="w-6 h-6 ml-4"
      >
        {themeMode === ThemeMode.Dark ? <LightSvg /> : <DarkSvg />}
      </Button>,
    )
  }, [themeMode, toggleTheme])

  return (
    <div className="w-full h-full">
      <div className="flex flex-row  p-2 justify-between items-center bg-info text-info-content">
        <div className="flex flex-row items-center">
          <a href="/" className="flex-0">
            <h1 className="text-2xl font-heading">
              Chatfall Admin
              <strong className="block text-xs text-info-content/50">
                {config.server}
              </strong>
            </h1>
          </a>
          {modeSwitcherBtn}
        </div>
        {loggedInUser && (
          <div className="text-right flex items-center">
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
              <>
                {settings ? (
                  <Router location={path}>
                    <AppRoutes />
                  </Router>
                ) : (
                  <div className="flex flex-row justify-center items-center w-full">
                    <div className="skeleton h-32 w-5/6" />
                  </div>
                )}
              </>
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
