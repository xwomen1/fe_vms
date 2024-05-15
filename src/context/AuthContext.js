import { createContext, useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import authConfig from 'src/configs/auth'
import { USER_API } from 'src/@core/components/api-url'
import { postApi } from 'src/@core/utils/requestUltils'

const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(defaultProvider.user)
  const [expire, setExpire] = useState('')
  const [loading, setLoading] = useState(defaultProvider.loading)
  const router = useRouter()

  const checkTokenExpiration = useCallback(token => {
    if (!token) {
      return true
    }

    const tokenData = parseToken(token)
    const expirationTime = tokenData.exp * 1000

    return Date.now() >= expirationTime
  }, [])

  const parseToken = token => {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

    return JSON.parse(window.atob(base64))
  }

  const handleLogout = useCallback(() => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }, [router])

  useEffect(() => {
    const initAuth = async () => {
      const storedUserData = window.localStorage.getItem('userData')
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      const refresh_token = localStorage.getItem(authConfig.onTokenExpiration)

      if (storedUserData && storedToken) {
        const userData = JSON.parse(storedUserData)
        setUser(userData)

        const tokenExpired = checkTokenExpiration(storedToken)
        if (tokenExpired) {
          try {
            setLoading(true)
            const tokenData = parseToken(storedToken)
            const expirationTime = tokenData.exp * 1000
            const currentTime = Date.now()
            const timeUntilExpiration = expirationTime - currentTime
            const refreshTime = timeUntilExpiration - 5 * 1000
            if (refreshTime > 0) {
              setTimeout(async () => {
                try {
                  const refreshedToken = await refreshAccessToken(refresh_token)
                  localStorage.setItem(authConfig.storageTokenKeyName, refreshedToken)
                  setLoading(false)
                } catch (error) {
                  console.error('Error refreshing token:', error)
                  handleLogout()
                }
              }, refreshTime)
            } else {
              // Token has already expired, refresh immediately
              const refreshedToken = await refreshAccessToken(refresh_token)
              localStorage.setItem(authConfig.storageTokenKeyName, refreshedToken)
              setLoading(false)
            }
          } catch (error) {
            console.error('Error refreshing token:', error)
            handleLogout()

            return
          }
        }

        setLoading(false)
      } else {
        setLoading(false)
      }
    }

    initAuth()
  }, [checkTokenExpiration, handleLogout])

  const refreshAccessToken = async refreshToken => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      // ** Đặt header Authorization bằng token

      const params = {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: { refreshToken }
      }
      const response = await postApi(USER_API.REFREST, { refreshToken })
      const newAccessToken = response.data.access_token
      setExpire(response.data.expires_in)

      return newAccessToken
    } catch (error) {
      throw new Error('Error refreshing token')
    }
  }

  const handleLogin = (params, errorCallback) => {
    postApi(USER_API.LOGIN, params)
      .then(async response => {
        const tokenReturn = response.data.access_token
        const refreshToken = response.data.refresh_token
        localStorage.setItem(authConfig.storageTokenKeyName, tokenReturn)
        localStorage.setItem(authConfig.onTokenExpiration, refreshToken)

        const returnUrl = router.query.returnUrl
        setExpire(response.data.expires_in)

        const apiUser = {
          username: params.username,
          role: 'admin'
        }
        setUser(apiUser)
        window.localStorage.setItem('userData', JSON.stringify(apiUser))
        setLoading(false)

        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
