import { contentQuery } from '@seerist/validators/models/content'
import { defineTool } from './types.js'

const {
  query,
  keywords,
  keywordOperator,
  filters,
  occurredAt,
  publishedAt,
  lastPublishedAt,
  minScore,
  page,
  perPage,
  sortBy,
  sortOrder,
  format,
} = contentQuery.shape

export const contentSearchTool = defineTool({
  name: 'content_search',
  description:
    'Search Seerist intelligence content by query, keywords, filters, and date ranges. ' +
    'Returns paginated results with facet aggregations.',
  inputSchema: {
    query,
    keywords,
    keywordOperator,
    filters,
    occurredAt,
    publishedAt,
    lastPublishedAt,
    minScore,
    page,
    perPage,
    sortBy,
    sortOrder,
    format,
  },
  async handler(args, client) {
    const results = await client.content.search({
      query: args.query,
      keywords: args.keywords,
      keywordOperator: args.keywordOperator,
      filters: args.filters,
      occurredAt: args.occurredAt,
      publishedAt: args.publishedAt,
      minScore: args.minScore,
      page: args.page,
      perPage: args.perPage,
      sortBy: args.sortBy,
      sortOrder: args.sortOrder,
      format: args.format,
    })
    return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] }
  },
  cli: {
    command: ['content', 'search'],
    positionals: ['query'],
  },
})
