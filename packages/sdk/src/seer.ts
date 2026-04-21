import { createRawClient, type SeerClientOptions } from './client.js'
import { createContentDomain } from './domains/content.js'

/**
 * Ergonomic wrapper around the generated OpenAPI client.
 *
 * Each domain gets a namespace with friendly method signatures.
 * This is the primary interface for both the CLI and MCP server.
 *
 * Example:
 *   const seer = createSeerClient({ token: '...' })
 *   const results = await seer.content.search({ query: 'election' })
 *   const item = await seer.content.get('some-id')
 */
export function createSeerClient(options: SeerClientOptions) {
  const client = createRawClient(options)

  return {
    /** Raw openapi-fetch client for escape-hatch access */
    raw: client,

    content: createContentDomain(client),

    // --- Stubs — add domains as endpoints are prioritized ---

    risk: {
      // TODO: ratings(location, options?)
      // TODO: pulse(location, options?)
    },

    assets: {
      // TODO: list(filters?)
      // TODO: create(asset)
      // TODO: update(id, asset)
      // TODO: delete(id)
    },

    alerts: {
      // TODO: list(filters?)
      // TODO: subscribe(config)
    },

    anna: {
      // TODO: ask(question)
    },

    geo: {
      // TODO: countries()
      // TODO: country(id)
      // TODO: cities(countryId?)
    },
  }
}

export type SeerClient = ReturnType<typeof createSeerClient>
