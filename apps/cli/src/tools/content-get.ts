import { z } from 'zod'
import { defineTool } from './types.js'

export const contentGetTool = defineTool({
  name: 'content_get',
  description: 'Retrieve a specific content item by ID',
  inputSchema: {
    id: z.string().describe('Content item ID'),
  },
  async handler(args, client) {
    const item = await client.content.get(args.id)
    return { content: [{ type: 'text', text: JSON.stringify(item, null, 2) }] }
  },
  cli: {
    command: ['content', 'get'],
    positionals: ['id'],
  },
})
