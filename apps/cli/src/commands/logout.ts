import { clearCredentials } from '../auth/store.js'

await clearCredentials()
console.log('Logged out. Stored credentials have been removed.')
