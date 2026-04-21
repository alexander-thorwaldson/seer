import type { z } from 'zod'
import type { SeerClient } from '@seerist/seer-sdk'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

/**
 * A tool definition that can be registered with both the MCP server and the CLI.
 *
 * The inputSchema is a Zod raw shape (object of Zod types) — the same format
 * that McpServer.registerTool() accepts. The generic preserves type inference
 * so handlers get properly typed args without casts.
 */
export interface ToolDefinition<TShape extends z.ZodRawShape = z.ZodRawShape> {
  /** Tool name used in MCP and CLI routing (e.g. 'content_search') */
  name: string
  /** Human-readable description shown in MCP tool list and CLI help */
  description: string
  /** Zod raw shape for input parameters — used by MCP validation and CLI arg parsing */
  inputSchema: TShape
  /** Handler receives validated input and a SeerClient, returns MCP-shaped result */
  handler: (args: z.infer<z.ZodObject<TShape>>, client: SeerClient) => Promise<CallToolResult>
  /** CLI-specific metadata for mapping to subcommands */
  cli: {
    /** Command path segments, e.g. ['content', 'search'] maps to `seer content search` */
    command: string[]
    /** Map positional CLI args to schema keys, in order */
    positionals?: string[]
  }
}

/** Helper to define a tool with full type inference */
export function defineTool<TShape extends z.ZodRawShape>(
  def: ToolDefinition<TShape>
): ToolDefinition<TShape> {
  return def
}
