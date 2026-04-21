import { describe, it, expect } from 'vitest'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const exec = promisify(execFile)
const __dirname = dirname(fileURLToPath(import.meta.url))
const cli = resolve(__dirname, '../src/cli.ts')

describe('seer cli', () => {
  it('prints version with --version', async () => {
    const { stdout } = await exec('npx', ['tsx', cli, '--version'])
    expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/)
  })

  it('prints help with --help', async () => {
    const { stdout } = await exec('npx', ['tsx', cli, '--help'])
    expect(stdout).toContain('seer')
    expect(stdout).toContain('Auth:')
    expect(stdout).toContain('Tools:')
  })

  it('exits with error on unknown command', async () => {
    await expect(exec('npx', ['tsx', cli, 'nonsense'])).rejects.toThrow()
  })
})
