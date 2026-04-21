#!/usr/bin/env node

import { parseArgs } from 'node:util'
import { allTools } from './tools/index.js'

const { positionals, values } = parseArgs({
  allowPositionals: true,
  strict: false,
  options: {
    help: { type: 'boolean', short: 'h' },
    version: { type: 'boolean', short: 'v' },
  },
})

const command = positionals[0]

if (values.version) {
  console.log('0.1.0')
  process.exit(0)
}

if (values.help || !command) {
  const toolCommands = allTools
    .map((t) => `    ${t.cli.command.join(' ').padEnd(18)} ${t.description}`)
    .join('\n')

  console.log(`
  seer - Seerist Intelligence Platform CLI

  Usage:
    seer <command> [options]

  Auth:
    login              Authenticate with Seerist (OAuth2)
    logout             Clear stored credentials
    whoami             Show current auth status

  MCP:
    mcp                Start the MCP server (stdio)

  Tools:
${toolCommands}

  Options:
    -h, --help         Show this help message
    -v, --version      Show version
  `)
  process.exit(0)
}

switch (command) {
  case 'mcp':
    await import('./commands/mcp.js')
    break
  case 'login':
    await import('./commands/login.js')
    break
  case 'logout':
    await import('./commands/logout.js')
    break
  case 'whoami':
    await import('./commands/whoami.js')
    break
  default: {
    const { runToolCommand } = await import('./commands/run.js')
    // Pass all positionals and any extra flags
    const { help: _h, version: _v, ...flags } = values
    await runToolCommand(positionals, flags as Record<string, string | boolean | undefined>)
  }
}
