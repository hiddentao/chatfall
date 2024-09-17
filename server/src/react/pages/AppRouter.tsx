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
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom"
import { StaticRouter } from "react-router-dom/server"
import {
  DarkSvg,
  DropdownArrowSvg,
  LightSvg,
  LogoutSvg,
} from "../components/Svg"
import { useThemeContext } from "../contexts/theme"
import { type ServerStore } from "../store/server"
import { BlacklistedDomains } from "./BlacklistedDomains"
import { BlacklistedEmails } from "./BlacklistedEmails"
import { BlacklistedWords } from "./BlacklistedWords"
import { Home } from "./Home"

const navLinks = [
  { to: "/", text: "General settings", element: <Home /> },
  {
    to: "/blacklisted-emails",
    text: "Blacklisted Emails",
    element: <BlacklistedEmails />,
  },
  {
    to: "/blacklisted-domains",
    text: "Blacklisted Domains",
    element: <BlacklistedDomains />,
  },
  {
    to: "/blacklisted-words",
    text: "Blacklisted Words",
    element: <BlacklistedWords />,
  },
  // { to: "/comments", text: "All Comments", element: <Comments /> },
]

const AppRoutes = () => {
  const location = useLocation()

  const handleDropdownClick = useCallback(() => {
    const dropdown = document.activeElement as HTMLElement
    dropdown.blur()
  }, [])

  const menuText = useMemo(() => {
    return navLinks.find((link) => link.to === location.pathname)?.text
  }, [location.pathname])

  return (
    <>
      <nav className="flex flex-col sm:flex-row">
        <div className="tabs tabs-boxed hidden sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`tab ${location.pathname === link.to ? "tab-active" : ""} min-h-[3rem] h-auto py-2`}
            >
              {link.text}
            </Link>
          ))}
        </div>
        <div className="dropdown dropdown-bottom sm:hidden">
          <label tabIndex={0} className="btn m-1">
            {menuText}
            <DropdownArrowSvg />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            {navLinks.map((link, index) => (
              <li key={index}>
                <Link to={link.to} onClick={handleDropdownClick}>
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <Routes>
        {navLinks.map((link) => (
          <Route key={link.to} path={link.to} element={link.element} />
        ))}
      </Routes>
    </>
  )
}

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
    lastError,
    clearLastError,
    settingUpdated,
    clearSettingUpdatedFlag,
  } = store.useStore()
  const [creatingAdmin, setCreatingAdmin] = useState(false)

  const handleErrorDismiss = useCallback(() => {
    clearLastError()
  }, [clearLastError])

  const handleSettingUpdatedDismiss = useCallback(() => {
    clearSettingUpdatedFlag()
  }, [clearSettingUpdatedFlag])

  // clear setting updated flag after 3 seconds
  useEffect(() => {
    if (settingUpdated) {
      const timer = setTimeout(() => {
        clearSettingUpdatedFlag()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [settingUpdated, clearSettingUpdatedFlag])

  const onEmailVerified = useCallback(async () => {
    setCreatingAdmin(false)
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
          <h1 className="text-2xl font-heading">
            Chatfall Admin
            <strong className="block text-xs text-info-content/50">
              {config.server}
            </strong>
          </h1>
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
      <div className="flex-1 flex flex-col items-center justify-center mt-2 px-4 py-4">
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
                  <p className="border-gray-500 border rounded-md p-4 text-lg mb-4">
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
      {settingUpdated ? (
        <div className="toast toast-bottom toast-end">
          <div
            className="alert alert-success cursor-pointer"
            onClick={handleSettingUpdatedDismiss}
          >
            Setting updated!
          </div>
        </div>
      ) : null}
      {lastError ? (
        <div className="toast toast-bottom toast-end">
          <div
            className="alert alert-error cursor-pointer"
            onClick={handleErrorDismiss}
          >
            <span>{lastError}</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}
