// Use localhost for local dev to avoid dead ngrok URLs
const BACKEND_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : (process.env.BACKEND_URL || 'http://localhost:3001');

export async function analyzeGrammar(text: string, language: string = 'vi', systemPrompt?: string) {
  const response = await fetch(`${BACKEND_URL}/api/analyze-grammar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, language, systemPrompt }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to analyze grammar')
  }

  return response.json()
}

export async function analyzeTone(text: string, targetTone: string, language: string = 'vi', systemPrompt?: string) {
  const response = await fetch(`${BACKEND_URL}/api/analyze-tone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, targetTone, language, systemPrompt }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to analyze tone')
  }

  return response.json()
}

export async function analyzeRewrite(text: string, context?: string, systemPrompt?: string, userPrompt?: string) {
  const response = await fetch(`${BACKEND_URL}/api/rewrite`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, context, systemPrompt, userPrompt }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to analyze rewrite')
  }

  return response.json()
}
