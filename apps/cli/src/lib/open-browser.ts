import { exec } from 'node:child_process'
import { platform } from 'node:os'

export function openBrowser(url: string): void {
  const os = platform()
  const cmd = os === 'darwin' ? 'open' : os === 'win32' ? 'start' : 'xdg-open'

  exec(`${cmd} ${JSON.stringify(url)}`)
}
