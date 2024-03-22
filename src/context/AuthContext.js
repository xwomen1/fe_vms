import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import authConfig from 'src/configs/auth'

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
  const checkTokenExpiration = (token) => {
    if (!token) {
      return true; // Nếu không có token, coi như token đã hết hạn
    }
  
    const tokenData = parseToken(token); // Hàm parseToken để lấy thông tin từ token, ví dụ lấy thời gian hết hạn
    const expirationTime = tokenData.exp * 1000; // Convert expiration time to milliseconds
  
    return Date.now() >= expirationTime; // Trả về true nếu thời gian hiện tại lớn hơn hoặc bằng thời gian hết hạn
  };
  
  const parseToken = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  };
  useEffect(() => {
    const initAuth = async () => {
      const storedUserData = window.localStorage.getItem('userData');
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);
      const refresh_token = localStorage.getItem(authConfig.onTokenExpiration)

      if (storedUserData && storedToken) {
        const userData = JSON.parse(storedUserData);
        setUser(userData);
  
        const tokenExpired = checkTokenExpiration(storedToken);
        if (tokenExpired) {
          try {
            setLoading(true);
            // Get the expiration time of the token
            const tokenData = parseToken(storedToken);
            const expirationTime = tokenData.exp * 1000;
            const currentTime = Date.now();
            const timeUntilExpiration = expirationTime - currentTime;
  
            // Schedule a refresh a few seconds before expiration
            const refreshTime = timeUntilExpiration - (5 * 1000); // 5 seconds before expiration
            if (refreshTime > 0) {
              setTimeout(async () => {
                try {
                  const refreshedToken = await refreshAccessToken(refresh_token);
                  localStorage.setItem(authConfig.storageTokenKeyName, refreshedToken);
                  setLoading(false);
                } catch (error) {
                  console.error('Error refreshing token:', error);
                  handleLogout();
                }
              }, refreshTime);
            } else {
              // Token has already expired, refresh immediately
              const refreshedToken = await refreshAccessToken(refresh_token);
              localStorage.setItem(authConfig.storageTokenKeyName, refreshedToken);
              setLoading(false);
            }
          } catch (error) {
            console.error('Error refreshing token:', error);
            handleLogout(); // Đăng xuất người dùng nếu không thể làm mới token
            return;
          }
        }
  
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
  
    initAuth();
  }, []);
  
  
  const refreshAccessToken = async (refreshToken) => {
    try {
      const token = localStorage.getItem(authConfig.storageTokenKeyName)

      console.log('token', token)
      // ** Đặt header Authorization bằng token
      const params = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { refreshToken },

      };
      const response = await axios.post('https://dev-ivi.basesystem.one/smc/iam/api/v0/refresh-token', { refreshToken }, params);
      const newAccessToken = response.data.access_token;
      setExpire(response.data.expires_in);
      return newAccessToken;
    } catch (error) {
      throw new Error('Error refreshing token');
    }
  };
  

  const handleLogin = (params, errorCallback) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        const tokenReturn = response.data.access_token
        const refreshToken = response.data.refresh_token
        localStorage.setItem(authConfig.storageTokenKeyName, tokenReturn)
        localStorage.setItem(authConfig.onTokenExpiration, refreshToken)

        console.log('tokenreturn', tokenReturn)
        const returnUrl = router.query.returnUrl
        setExpire(response.data.expires_in)
        console.log(response.data.expires_in)
        const apiUser = {
          username: params.username,
          role: 'admin'
        }
        setUser(apiUser)
        window.localStorage.setItem('userData', JSON.stringify(apiUser))
        setLoading(false)
  
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        console.log('URL', redirectURL)
        router.replace(redirectURL)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
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
