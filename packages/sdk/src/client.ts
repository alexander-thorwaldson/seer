import createClient, { type Client } from 'openapi-fetch'
import type { paths } from './generated/api.js'

export interface SeerClientOptions {
  baseUrl?: string
  token: string
}

/**
 * Low-level typed client — auto-generated paths from OpenAPI.
 * Use `createSeerClient()` for the ergonomic wrapper.
 */
export function createRawClient(options: SeerClientOptions): Client<paths> {
  return createClient<paths>({
    baseUrl: options.baseUrl ?? 'https://scry.platform.seerist.com',
    headers: {
      Authorization: `Bearer ${options.token}`,
    },
  })
}
