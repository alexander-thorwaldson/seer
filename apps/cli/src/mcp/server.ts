import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'

export async function startMcpServer() {
  const server = new McpServer({
    name: 'seer',
    version: '0.1.0',
  })

  // --- Tool registrations ---
  // Each tool maps to a SeerClient method from the SDK.
  // Tools are what agents see and can invoke.
  //
  // TODO: Register tools as SDK domains are implemented, e.g.:
  //
  // server.tool('search_content', 'Search intelligence content', {
  //   query: z.string(),
  //   limit: z.number().optional(),
  // }, async ({ query, limit }) => {
  //   const seer = createSeerClient({ token: getToken() })
  //   const results = await seer.content.search(query, { limit })
  //   return { content: [{ type: 'text', text: JSON.stringify(results) }] }
  // })

  const transport = new StdioServerTransport()
  await server.connect(transport)
}
