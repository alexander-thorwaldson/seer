import { z } from 'zod'
import { createSeerClient } from '@seerist/seer-sdk'
import { allTools } from '../tools/index.js'
import { requireToken } from '../auth/token.js'
import { printToolResult } from '../lib/output.js'

export async function runToolCommand(
  positionals: string[],
  flags: Record<string, string | boolean | undefined>
) {
  // Find a tool whose cli.command matches the start of positionals
  const tool = allTools.find((t) => {
    const cmd = t.cli.command
    return cmd.length <= positionals.length && cmd.every((part, i) => positionals[i] === part)
  })

  if (!tool) {
    console.error(`Unknown command: ${positionals.join(' ')}`)
    console.error('Run `seer --help` for available commands.')
    process.exit(1)
  }

  // Remaining positionals after the command path become positional args
  const remaining = positionals.slice(tool.cli.command.length)

  // Build args from positionals and flags
  const args: Record<string, unknown> = {}

  if (tool.cli.positionals) {
    for (let i = 0; i < tool.cli.positionals.length; i++) {
      const value = remaining[i]
      if (value) {
        args[tool.cli.positionals[i]] = value
      }
    }
  }

  // Merge in any --flag values (convert kebab-case to camelCase)
  for (const [key, value] of Object.entries(flags)) {
    if (value !== undefined) {
      const camelKey = key.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
      args[camelKey] = value
    }
  }

  // Validate with Zod
  const schema = z.object(tool.inputSchema)
  const parsed = schema.safeParse(args)

  if (!parsed.success) {
    console.error(`Invalid arguments for '${tool.cli.command.join(' ')}':`)
    for (const issue of parsed.error.issues) {
      console.error(`  ${issue.path.join('.')}: ${issue.message}`)
    }
    process.exit(1)
  }

  const token = await requireToken()
  const client = createSeerClient({ token })
  const result = await tool.handler(parsed.data, client)
  printToolResult(result)
}
