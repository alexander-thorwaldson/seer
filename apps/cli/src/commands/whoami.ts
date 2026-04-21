import { loadCredentials } from '../auth/store.js'

const creds = await loadCredentials()

if (!creds) {
  console.log('Not authenticated. Run `seer login` to get started.')
  process.exit(1)
}

const now = Math.floor(Date.now() / 1000)
const expired = now >= creds.expires_at

// Decode the id_token payload to show user info (JWT is base64url-encoded)
if (creds.id_token) {
  try {
    const payload = JSON.parse(
      Buffer.from(creds.id_token.split('.')[1], 'base64url').toString()
    ) as { email?: string; name?: string; sub?: string }
    if (payload.email) console.log(`  Email: ${payload.email}`)
    if (payload.name) console.log(`  Name:  ${payload.name}`)
    if (payload.sub) console.log(`  Sub:   ${payload.sub}`)
  } catch {
    // Malformed token, skip user info
  }
}

if (expired) {
  console.log(
    `  Status: expired (${creds.refresh_token ? 'will auto-refresh' : 'run `seer login`'})`
  )
} else {
  const remaining = creds.expires_at - now
  const hours = Math.floor(remaining / 3600)
  const minutes = Math.floor((remaining % 3600) / 60)
  console.log(`  Status: authenticated (expires in ${String(hours)}h ${String(minutes)}m)`)
}
