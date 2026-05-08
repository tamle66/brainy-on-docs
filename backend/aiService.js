require('dotenv').config({ path: '../.env' });
const axios = require('axios');

const {
  MODEL_ID,
  GENERATE_CONTENT_API,
  vertexAPIkey,
} = process.env;

const vertexUrl = `https://aiplatform.googleapis.com/v1/publishers/google/models/${MODEL_ID}:${GENERATE_CONTENT_API}?key=${vertexAPIkey}`;

/**
 * Call Vertex AI Gemini 2.5 Flash API
 */
async function callGemini(prompt) {
  try {
    const response = await axios.post(
      vertexUrl,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const resultText = response.data.candidates[0].content.parts[0].text;
    return JSON.parse(resultText);
  } catch (error) {
    console.error('Gemini API Error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

/**
 * Analyze grammar and spelling
 */
async function analyzeGrammar(text, language) {
  const prompt = `
Bạn là một chuyên gia ngôn ngữ học. Hãy phân tích đoạn văn sau và tìm các lỗi chính tả, lỗi ngữ pháp hoặc câu lủng củng.
Ngôn ngữ: ${language}
Đoạn văn: "${text}"

Trả về KẾT QUẢ DUY NHẤT LÀ JSON (không giải thích thêm) theo định dạng sau:
{
  "errors": [
    {
      "original": "từ/cụm từ sai",
      "replacement": "từ/cụm từ đúng",
      "reason": "Giải thích ngắn gọn lý do sửa"
    }
  ]
}
Nếu không có lỗi, mảng errors trả về rỗng.
  `;

  return await callGemini(prompt);
}

/**
 * Analyze tone and rewrite based on target tone
 */
async function analyzeTone(text, targetTone, language) {
  const prompt = `
Bạn là một chuyên gia về văn phong. Hãy phân tích sắc thái (tone) của đoạn văn sau và viết lại nó theo sắc thái mục tiêu được yêu cầu.
Ngôn ngữ: ${language}
Sắc thái mục tiêu: ${targetTone}
Đoạn văn: "${text}"

Trả về KẾT QUẢ DUY NHẤT LÀ JSON (không giải thích thêm) theo định dạng sau:
{
  "current_tone": "Sắc thái hiện tại của đoạn văn gốc",
  "tone_score": 85, // Thang điểm 0-100 đánh giá mức độ phù hợp của bản gốc với targetTone
  "rewritten_text": "Phiên bản viết lại của đoạn văn phù hợp với sắc thái mục tiêu"
}
  `;

  return await callGemini(prompt);
}

module.exports = {
  analyzeGrammar,
  analyzeTone,
};
