export default {
  meEndpoint: '/auth/me',
  loginEndpoint: 'https://dev-ivi.basesystem.one/smc/iam/api/v0/login-with-local',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'access_token',
  onTokenExpiration: 'refreshToken', // logout | refreshToken,
  username: 'userName' // logout | refreshToken
}
