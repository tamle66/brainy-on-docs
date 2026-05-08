const { analyzeGrammar } = require('../aiService');

describe('AI Service Integration Test', () => {
  it('should successfully call Gemini API and return grammar errors', async () => {
    const text = 'Tôi đi học bàng xe đạp'; // 'bàng' is wrong, should be 'bằng'
    const language = 'Vietnamese';
    
    const result = await analyzeGrammar(text, language);
    
    console.log('API Result:', JSON.stringify(result, null, 2));
    
    expect(result).toHaveProperty('errors');
    expect(Array.isArray(result.errors)).toBe(true);
    
    if (result.errors.length > 0) {
      expect(result.errors[0]).toHaveProperty('original');
      expect(result.errors[0]).toHaveProperty('replacement');
      expect(result.errors[0]).toHaveProperty('reason');
      expect(result.errors[0]).toHaveProperty('type');
      expect(['spelling', 'grammar']).toContain(result.errors[0].type);
    }
  }, 30000); // Set timeout to 30s for API call
});
