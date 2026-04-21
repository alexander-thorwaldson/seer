import { login } from '../auth/flow.js'

try {
  await login()
} catch (err) {
  console.error('Login failed:', err instanceof Error ? err.message : err)
  process.exit(1)
}
