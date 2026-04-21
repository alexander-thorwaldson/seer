import { createServer, type Server } from 'node:http'
import { randomBytes, createHash } from 'node:crypto'
import { getAuthConfig } from './config.js'
import { saveCredentials, type StoredCredentials } from './store.js'
import { openBrowser } from '../lib/open-browser.js'

function base64url(buffer: Buffer): string {
  return buffer.toString('base64url')
}

function generateCodeVerifier(): string {
  return base64url(randomBytes(32))
}

function generateCodeChallenge(verifier: string): string {
  return base64url(createHash('sha256').update(verifier).digest())
}

interface TokenResponse {
  access_token: string
  refresh_token?: string
  id_token?: string
  token_type: string
  expires_in: number
}

async function exchangeCode(
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<StoredCredentials> {
  const config = getAuthConfig()

  const response = await fetch(`https://${config.domain}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: config.clientId,
      code,
      code_verifier: codeVerifier,
      redirect_uri: redirectUri,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Token exchange failed (${String(response.status)}): ${body}`)
  }

  const data = (await response.json()) as TokenResponse

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    id_token: data.id_token,
    token_type: data.token_type,
    expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
  }
}

function waitForCallback(server: Server): Promise<{ code: string; redirectUri: string }> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      server.close()
      reject(new Error('Login timed out waiting for browser callback'))
    }, 120_000)

    server.on('request', (req, res) => {
      const url = new URL(req.url ?? '/', `http://localhost`)

      if (url.pathname !== '/callback') {
        res.writeHead(404)
        res.end()
        return
      }

      const code = url.searchParams.get('code')
      const error = url.searchParams.get('error')

      if (error) {
        const description = url.searchParams.get('error_description') ?? error
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(
          `<html><body><h2>Login failed</h2><p>${description}</p><p>You can close this tab.</p></body></html>`
        )
        clearTimeout(timeout)
        server.close()
        reject(new Error(`Auth error: ${description}`))
        return
      }

      if (!code) {
        res.writeHead(400)
        res.end('Missing authorization code')
        return
      }

      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(
        '<html><body><h2>Login successful!</h2><p>You can close this tab and return to the terminal.</p></body></html>'
      )
      clearTimeout(timeout)
      server.close()

      const address = server.address()
      const port = typeof address === 'object' && address ? address.port : 0
      resolve({ code, redirectUri: `http://localhost:${String(port)}/callback` })
    })
  })
}

export async function login(): Promise<void> {
  const config = getAuthConfig()
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = generateCodeChallenge(codeVerifier)

  // Start temporary server on random port
  const server = createServer()
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : 0
  const redirectUri = `http://localhost:${String(port)}/callback`

  const authorizeUrl = new URL(`https://${config.domain}/authorize`)
  authorizeUrl.searchParams.set('response_type', 'code')
  authorizeUrl.searchParams.set('client_id', config.clientId)
  authorizeUrl.searchParams.set('redirect_uri', redirectUri)
  authorizeUrl.searchParams.set('code_challenge', codeChallenge)
  authorizeUrl.searchParams.set('code_challenge_method', 'S256')
  authorizeUrl.searchParams.set('scope', config.scopes)
  authorizeUrl.searchParams.set('audience', config.audience)

  console.log('Opening browser for login...')
  openBrowser(authorizeUrl.toString())
  console.log(`\nIf the browser doesn't open, visit:\n${authorizeUrl.toString()}\n`)

  const { code } = await waitForCallback(server)

  console.log('Exchanging authorization code for tokens...')
  const credentials = await exchangeCode(code, codeVerifier, redirectUri)
  await saveCredentials(credentials)

  console.log('Login successful!')
}
