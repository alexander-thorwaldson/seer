import type { Client } from 'openapi-fetch'
import type { paths, components } from '../generated/api.js'

type ContentSearchBody = NonNullable<
  paths['/content/search']['post']['requestBody']
>['content']['application/json']

type ContentSearchQuery = NonNullable<paths['/content/search']['post']['parameters']['query']>

export interface SearchOptions {
  query?: string
  keywords?: string
  keywordOperator?: 'AND' | 'OR'
  filters?: Record<string, string[]>
  page?: number
  perPage?: number
  sortBy?: ContentSearchQuery['sortBy']
  sortOrder?: ContentSearchQuery['sortOrder']
  format?: ContentSearchQuery['format']
  occurredAt?: ContentSearchBody['occurredAt']
  publishedAt?: ContentSearchBody['publishedAt']
  minScore?: number
}

export type ContentItem = components['schemas']['ContentListItem']
export type ContentFull = components['schemas']['Content']
export type PaginatedContent = components['schemas']['PaginatedContentWithFacets']

export function createContentDomain(client: Client<paths>) {
  return {
    async search(options: SearchOptions = {}) {
      const {
        query,
        keywords,
        keywordOperator,
        filters,
        page,
        perPage,
        sortBy,
        sortOrder,
        format,
        occurredAt,
        publishedAt,
        minScore,
      } = options

      const { data, response } = await client.POST('/content/search', {
        params: {
          query: { page, perPage, sortBy, sortOrder, format },
        },
        body: {
          query,
          keywords,
          keywordOperator,
          filters,
          occurredAt,
          publishedAt,
          minScore,
        },
      })

      if (!response.ok || !data) {
        throw new Error(`Content search failed (${String(response.status)})`)
      }
      return data
    },

    async get(id: string) {
      const { data, response } = await client.GET('/content/{id}', {
        params: { path: { id } },
      })

      if (!response.ok || !data) {
        throw new Error(`Content not found: ${id} (${String(response.status)})`)
      }
      return data
    },
  }
}
