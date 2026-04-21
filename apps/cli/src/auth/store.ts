import { mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { homedir } from 'node:os'

export interface StoredCredentials {
  access_token: string
  refresh_token?: string
  id_token?: string
  token_type: string
  expires_at: number
}

const CONFIG_DIR = join(homedir(), '.config', 'seer')
const CREDENTIALS_FILE = join(CONFIG_DIR, 'credentials.json')

export async function loadCredentials(): Promise<StoredCredentials | null> {
  try {
    const raw = await readFile(CREDENTIALS_FILE, 'utf-8')
    return JSON.parse(raw) as StoredCredentials
  } catch {
    return null
  }
}

export async function saveCredentials(creds: StoredCredentials): Promise<void> {
  await mkdir(CONFIG_DIR, { recursive: true, mode: 0o700 })
  await writeFile(CREDENTIALS_FILE, JSON.stringify(creds, null, 2), { mode: 0o600 })
}

export async function clearCredentials(): Promise<void> {
  try {
    await rm(CREDENTIALS_FILE)
  } catch {
    // Already gone
  }
}
