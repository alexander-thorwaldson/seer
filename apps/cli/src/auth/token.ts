import { loadCredentials, saveCredentials, type StoredCredentials } from './store.js'
import { getAuthConfig } from './config.js'

function isExpired(creds: StoredCredentials): boolean {
  // Consider expired 60s before actual expiry to avoid edge cases
  return Date.now() >= (creds.expires_at - 60) * 1000
}

async function refreshAccessToken(refreshToken: string): Promise<StoredCredentials> {
  const config = getAuthConfig()
  const response = await fetch(`https://${config.domain}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      client_id: config.clientId,
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    throw new Error(`Token refresh failed (${String(response.status)})`)
  }

  const data = (await response.json()) as {
    access_token: string
    refresh_token?: string
    id_token?: string
    token_type: string
    expires_in: number
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token ?? refreshToken,
    id_token: data.id_token,
    token_type: data.token_type,
    expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
  }
}

/**
 * Get a valid access token, refreshing if needed.
 * Exits the process with an error message if not authenticated.
 */
export async function requireToken(): Promise<string> {
  const creds = await loadCredentials()

  if (!creds) {
    console.error('Not authenticated. Run `seer login` first.')
    process.exit(1)
  }

  if (isExpired(creds)) {
    if (creds.refresh_token) {
      try {
        const refreshed = await refreshAccessToken(creds.refresh_token)
        await saveCredentials(refreshed)
        return refreshed.access_token
      } catch {
        console.error('Session expired and refresh failed. Run `seer login` to re-authenticate.')
        process.exit(1)
      }
    }
    console.error('Session expired. Run `seer login` to re-authenticate.')
    process.exit(1)
  }

  return creds.access_token
}
