import { describe, it, expect } from 'vitest'
import { buildProductFaqJsonLd } from './faq-jsonld'

describe('buildProductFaqJsonLd', () => {
  it('round-trips through JSON.stringify / JSON.parse', () => {
    const schema = buildProductFaqJsonLd()
    expect(JSON.parse(JSON.stringify(schema))).toEqual(schema)
  })

  it('sets @context to https://schema.org', () => {
    expect(buildProductFaqJsonLd()['@context']).toBe('https://schema.org')
  })

  it('sets @type to FAQPage', () => {
    expect(buildProductFaqJsonLd()['@type']).toBe('FAQPage')
  })

  it('mainEntity is a non-empty array', () => {
    const { mainEntity } = buildProductFaqJsonLd() as { mainEntity: unknown[] }
    expect(Array.isArray(mainEntity)).toBe(true)
    expect(mainEntity.length).toBeGreaterThan(0)
  })

  it('every entry in mainEntity has @type Question', () => {
    const { mainEntity } = buildProductFaqJsonLd() as {
      mainEntity: Array<Record<string, unknown>>
    }
    for (const item of mainEntity) {
      expect(item['@type']).toBe('Question')
    }
  })

  it('every Question has a non-empty name and an acceptedAnswer with @type Answer', () => {
    const { mainEntity } = buildProductFaqJsonLd() as {
      mainEntity: Array<Record<string, unknown>>
    }
    for (const item of mainEntity) {
      expect(typeof item.name).toBe('string')
      expect((item.name as string).length).toBeGreaterThan(0)
      const answer = item.acceptedAnswer as Record<string, unknown>
      expect(answer['@type']).toBe('Answer')
      expect(typeof answer.text).toBe('string')
      expect((answer.text as string).length).toBeGreaterThan(0)
    }
  })

  it('is deterministic — two calls produce equal output', () => {
    expect(buildProductFaqJsonLd()).toEqual(buildProductFaqJsonLd())
  })
})
