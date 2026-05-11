require('dotenv').config(); // Load from current dir
require('dotenv').config({ path: '../.env' }); // Fallback for local dev if needed
const express = require('express');
const cors = require('cors');
const { analyzeGrammar, analyzeTone, analyzeRewrite } = require('./aiService');

const app = express();
const PORT = process.env.PORT || 3001;

// Allow CORS for the frontend Add-on
app.use(cors());
app.use(express.json());

// Endpoint: Grammar & Spelling Analysis
app.post('/api/analyze-grammar', async (req, res) => {
  try {
    const { text, language = 'vi', systemPrompt } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const result = await analyzeGrammar(text, language, systemPrompt);
    res.json(result);
  } catch (error) {
    console.error('Error in analyze-grammar:', error.message);
    res.status(500).json({ error: 'Failed to analyze grammar' });
  }
});

// Endpoint: Tone Analysis & Rewrite
app.post('/api/analyze-tone', async (req, res) => {
  try {
    const { text, targetTone, language = 'vi', systemPrompt } = req.body;
    
    if (!text || !targetTone) {
      return res.status(400).json({ error: 'Text and targetTone are required' });
    }

    const result = await analyzeTone(text, targetTone, language, systemPrompt);
    res.json(result);
  } catch (error) {
    console.error('Error in analyze-tone:', error.message);
    res.status(500).json({ error: 'Failed to analyze tone' });
  }
});

// Endpoint: Rewrite based on System Prompt
app.post('/api/rewrite', async (req, res) => {
  try {
    const { text, context, systemPrompt, userPrompt } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const result = await analyzeRewrite(text, context, systemPrompt, userPrompt);
    res.json(result);
  } catch (error) {
    console.error('Error in rewrite:', error.message);
    res.status(500).json({ error: 'Failed to rewrite text' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Ngrok URL configured as: ${process.env.ngrokURL}`);
});
