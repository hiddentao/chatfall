const IS_CLIENT_SIDE = typeof window !== "undefined"

const DUMMY_LOCAL_STORAGE = {
  getItem: (key: string) => "",
  setItem: (key: string, value: string) => {},
  removeItem: (key: string) => {},
}

export interface JwtToken {
  token: string
}

/**
 * Immutable JWT class.
 *
 * The JWT is stored in the local storage.
 * The setToken() and removeToken() methods return a new instance of the class.
 */
export class Jwt {
  private localStorage: any = IS_CLIENT_SIDE
    ? window.localStorage
    : DUMMY_LOCAL_STORAGE
  private token?: JwtToken

  constructor() {
    this._loadToken()
  }

  private _loadToken() {
    try {
      const data = JSON.parse(
        this.localStorage.getItem("chatfall") || "{}",
      ) as JwtToken
      if (data.token) {
        this.token = data
        console.debug("Loaded JWT")
      }
    } catch (e: any) {
      console.warn(`Error parsing stored JWT: ${e.message}`)
    }
  }

  private _saveToken(token: JwtToken) {
    this.localStorage.setItem("chatfall", JSON.stringify(token))
    this.token = token
    console.debug("Saved JWT")
  }

  private _clearToken() {
    this.localStorage.removeItem("chatfall")
    this.token = undefined
    console.debug("Removed JWT")
  }

  public getToken() {
    return this.token
  }

  public setToken(token: JwtToken) {
    this._saveToken(token)
  }

  public removeToken() {
    this._clearToken()
  }
}

export const jwt = new Jwt()
