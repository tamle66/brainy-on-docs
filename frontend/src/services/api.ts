// Using the BACKEND_URL provided by Webpack DefinePlugin
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001'

export async function analyzeGrammar(text: string, language: string = 'vi') {
  const response = await fetch(`${BACKEND_URL}/api/analyze-grammar`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, language }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to analyze grammar')
  }

  return response.json()
}

export async function analyzeTone(text: string, targetTone: string, language: string = 'vi') {
  const response = await fetch(`${BACKEND_URL}/api/analyze-tone`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, targetTone, language }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to analyze tone')
  }

  return response.json()
}
