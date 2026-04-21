import type { ToolDefinition } from './types.js'
import { contentSearchTool } from './content-search.js'
import { contentGetTool } from './content-get.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const allTools: readonly ToolDefinition<any>[] = [contentSearchTool, contentGetTool]

export { defineTool, type ToolDefinition } from './types.js'
