#!/usr/bin/env node

import { parseArgs } from 'node:util'

const { positionals, values } = parseArgs({
  allowPositionals: true,
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
  console.log(`
  seer - Seerist Intelligence Platform CLI

  Usage:
    seer <command> [options]

  Commands:
    mcp         Start the MCP server for AI agent access
    auth        Manage authentication

  Options:
    -h, --help     Show this help message
    -v, --version  Show version
  `)
  process.exit(0)
}

switch (command) {
  case 'mcp':
    await import('./commands/mcp.js')
    break
  case 'auth':
    await import('./commands/auth.js')
    break
  default:
    console.error(`Unknown command: ${command}`)
    process.exit(1)
}
