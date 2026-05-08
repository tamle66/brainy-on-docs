# Grammarly-like Add-on — Architecture

## Tech Stack
- **Frontend**: React, Webpack, Lark Docs Add-on SDK
- **Backend**: Node.js, Express
- **AI Service**: Google Vertex AI (Gemini 2.5 Flash)

## Project Structure
```
backend/
├── server.js
├── aiService.js
frontend/
├── src/
│   ├── index.tsx
│   ├── App.tsx
│   ├── components/
│   ├── services/
├── app.json
├── package.json
```

## Database Schema
N/A (Stateless Application)

## API Routes
- `POST /api/analyze-grammar`: Sends text to Vertex AI and returns identified errors and suggestions.

## Environment & Config
- **.env**: Contains Ngrok URL, Lark App IDs, and Vertex API Keys.
