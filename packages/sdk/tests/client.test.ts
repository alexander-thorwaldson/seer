import { describe, it, expect } from 'vitest'
import { createSeerClient } from '../src/index.js'

describe('createSeerClient', () => {
  it('returns a client with expected domain namespaces', () => {
    const client = createSeerClient({ token: 'test-token' })

    expect(client).toHaveProperty('raw')
    expect(client).toHaveProperty('risk')
    expect(client).toHaveProperty('content')
    expect(client).toHaveProperty('assets')
    expect(client).toHaveProperty('alerts')
    expect(client).toHaveProperty('anna')
    expect(client).toHaveProperty('geo')
  })

  it('exposes the raw openapi-fetch client', () => {
    const client = createSeerClient({ token: 'test-token' })

    expect(client.raw).toBeDefined()
    expect(client.raw.GET).toBeTypeOf('function')
    expect(client.raw.POST).toBeTypeOf('function')
  })
})
