import { describe, it, expect, vi } from 'vitest'
import { analyzeGrammar } from './api'

// Mock fetch
global.fetch = vi.fn()

describe('API Service', () => {
  it('should call analyzeGrammar and return data correctly', async () => {
    const mockResponse = { errors: [] }
    ;(fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await analyzeGrammar('Xin chào', 'vi')
    
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/analyze-grammar'), expect.any(Object))
    expect(result).toEqual(mockResponse)
  })
})
