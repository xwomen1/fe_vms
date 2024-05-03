const API_HOST = process.env.NEXT_PUBLIC_API_HOST

const USER_API = {
  ME: `${API_HOST}/auth/me`,
  LOGIN: `${API_HOST}/login-with-local`,
  REFREST: `${API_HOST}/refresh-token`
}

const GROUP_API = {
  SEARCH: `${API_HOST}/group/search`,
  ADD: `${API_HOST}/group`
}

const POLICY_API = {
  SEARCH: `${API_HOST}/policies/search`
}

export { USER_API, GROUP_API, POLICY_API }
