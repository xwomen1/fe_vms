const API_HOST = process.env.NEXT_PUBLIC_API_HOST
const VERSION = process.env.NEXT_PUBLIC_VERSION
const API_SBS = process.env.NEXT_PUBLIC_API_SBS
const API_IAM = `${API_HOST}/smc/iam/api/${VERSION}`
const API_CAMERA = `${API_SBS}/ivis/vms/api/${VERSION}`

const USER_API = {
  ME: `${API_IAM}/auth/me`,
  LOGIN: `${API_IAM}/login-with-local`,
  REFREST: `${API_IAM}/refresh-token`
}

const GROUP_API = {
  SEARCH: `${API_HOST}/group/search`,
  ADD: `${API_HOST}/group`
}

const POLICY_API = {
  SEARCH: `${API_CAMERA}/policies/search`
}

const CAMERA_API = {
  CAMERA_GROUP: `${API_CAMERA}/camera-groups`
}
export { USER_API, GROUP_API, POLICY_API, CAMERA_API }
