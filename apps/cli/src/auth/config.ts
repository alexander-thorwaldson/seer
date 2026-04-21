export interface AuthConfig {
  domain: string
  clientId: string
  audience: string
  scopes: string
}

export function getAuthConfig(): AuthConfig {
  return {
    domain: process.env.SEER_AUTH0_DOMAIN ?? 'auth.seerist.com',
    clientId: process.env.SEER_CLIENT_ID ?? 'PLACEHOLDER_CLIENT_ID',
    audience: process.env.SEER_AUDIENCE ?? 'https://api.seerist.com',
    scopes: 'openid profile email offline_access',
  }
}
