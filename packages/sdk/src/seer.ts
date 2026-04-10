import { createRawClient, type SeerClientOptions } from './client.js'

/**
 * Ergonomic wrapper around the generated OpenAPI client.
 *
 * Each domain (risk, content, assets, etc.) gets a namespace
 * that maps to friendly method signatures. This is the primary
 * interface for both the CLI and MCP server.
 *
 * Example:
 *   const seer = createSeerClient({ token: '...' })
 *   const ratings = await seer.risk.ratings('US')
 *   const results = await seer.content.search('election')
 */
export function createSeerClient(options: SeerClientOptions) {
  const client = createRawClient(options)

  return {
    /** Raw openapi-fetch client for escape-hatch access */
    raw: client,

    // --- Domain namespaces (stubs — flesh out as API endpoints are prioritized) ---

    risk: {
      // TODO: ratings(location, options?)
      // TODO: pulse(location, options?)
    },

    content: {
      // TODO: search(query, filters?)
      // TODO: get(id)
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
