import { Plugins } from "@capacitor/core"
import React, { createContext, useCallback, useContext, useState } from "react"
import { User } from "./user.model"

export interface AuthContext {
  user: User | null
}

export interface AuthContextInterface extends AuthContext {
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  // login: (email: string, password: string) => Promise<AuthResponseData>
  // signUp: (email: string, password: string) => Promise<AuthResponseData>
  logout: () => Promise<void>
  setUserData: (data: AuthResponseData) => void
}

export interface AuthResponseData {
  kind: string
  idToken: string
  email: string
  refreshToken: string
  localId: string
  expiresIn: string
  registered?: boolean
  displayName?: string
}

export interface StoredData {
  userId: string
  token: string
  expirationTime: string
  email: string
}

const initialContext: AuthContextInterface = {
  user: null,
  setUser: () => {},
  // login: {} as any,
  // signUp: {} as any,
  logout: {} as any,
  setUserData: {} as any,
}

const AuthContext = createContext(initialContext)

const AuthContextProvider: React.FC = React.memo((props) => {
  const [user, setUser] = useState<User | null>(null)
  let _logoutTimer = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    autoLogin()
    return () => {
      removeLogoutTimer()
    }
    //eslint-disable-next-line
  }, [])

  function setUserData(data: AuthResponseData) {
    const expirationTime = calculateExpirationDate(data.expiresIn)
    storeAuthData({
      token: data.idToken,
      expirationTime: expirationTime.toISOString(),
      userId: data.localId,
      email: data.email,
    })
    const user = new User(
      data.localId,
      data.email,
      data.idToken,
      expirationTime,
    )
    autologout(user.tokenDuration)

    setUser(user)
  }

  function calculateExpirationDate(expirationSeconds: string) {
    return new Date(new Date().getTime() + +expirationSeconds * 1000)
  }
  function storeAuthData(data: StoredData) {
    Plugins.Storage.set({ key: "authData", value: JSON.stringify(data) })
  }

  async function logout() {
    removeLogoutTimer()
    setUser(null)
    return Plugins.Storage.remove({ key: "authData" })
  }

  async function autoLogin() {
    return Plugins.Storage.get({
      key: "authData",
    })
      .then((data) => {
        if (!data || !data.value) {
          return null
        }
        const parsedData = JSON.parse(data.value) as StoredData
        const tokenExpirationDate = new Date(parsedData.expirationTime)

        if (tokenExpirationDate <= new Date()) {
          console.log("token expired")
          return null
        }
        console.log("token still valid")
        const { userId, email, token } = parsedData

        const user = new User(userId, email, token, tokenExpirationDate)
        autologout(user.tokenDuration)
        setUser(user)
      })
      .catch((err) => console.error(err))
  }

  function autologout(duration: number) {
    removeLogoutTimer()
    _logoutTimer.current = setTimeout(() => {
      logout()
    }, duration)
  }

  function removeLogoutTimer() {
    if (_logoutTimer.current) {
      clearTimeout(_logoutTimer.current)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user: user,
        setUser: setUser,
        logout: logout,
        setUserData,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
})

const useAuthContext = () => {
  const { user, setUser, logout, setUserData } = useContext(AuthContext)

  const addUser = useCallback((user: User | null) => setUser(user), [setUser])

  return {
    user,
    addUser,
    logout,
    setUserData,
  }
}

export { AuthContext, AuthContextProvider, useAuthContext }
