import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { createSeerClient } from '@seerist/seer-sdk'
import { allTools } from '../tools/index.js'
import { requireToken } from '../auth/token.js'

export function registerAllTools(server: McpServer) {
  for (const tool of allTools) {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        inputSchema: tool.inputSchema,
      },
      async (args: Record<string, unknown>) => {
        const token = await requireToken()
        const client = createSeerClient({ token })
        return tool.handler(args, client)
      }
    )
  }
}
