import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

export function printToolResult(result: CallToolResult): void {
  for (const item of result.content) {
    if (item.type === 'text') {
      console.log(item.text)
    }
  }
}
