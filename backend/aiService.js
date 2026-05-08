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
async function callGemini(prompt, systemPrompt = null) {
  try {
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
      }
    };

    if (systemPrompt) {
      payload.systemInstruction = {
        role: 'system',
        parts: [{ text: systemPrompt }]
      };
    }

    const response = await axios.post(
      vertexUrl,
      payload,
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
async function analyzeGrammar(text, language, systemPrompt = null) {
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
      "reason": "Giải thích ngắn gọn lý do sửa",
      "type": "spelling"
    }
  ]
}
Quy tắc phân loại trường "type":
- "spelling": lỗi chính tả, gõ sai ký tự, thiếu dấu.
- "grammar": lỗi ngữ pháp, dùng từ sai nghĩa, câu cú lủng củng.
Nếu không có lỗi, mảng errors trả về rỗng.
  `;

  return await callGemini(prompt, systemPrompt);
}

/**
 * Analyze tone and rewrite based on target tone
 */
async function analyzeTone(text, targetTone, language, systemPrompt = null) {
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

  return await callGemini(prompt, systemPrompt);
}

/**
 * Analyze text and rewrite it based on system prompt and user intent
 */
async function analyzeRewrite(text, systemPrompt = null) {
  // If systemPrompt is provided (from a Skill), the user prompt should be neutral
  // to avoid conflicting instructions (e.g. Skill says "Summarize" but User Prompt says "Rewrite").
  const userInstruction = systemPrompt 
    ? "Xử lý đoạn văn sau dựa trên chỉ thị hệ thống. Hãy bảo lưu định dạng Markdown nếu có."
    : "Hãy viết lại đoạn văn sau sao cho hay hơn, chuyên nghiệp hơn. Tôn trọng định dạng gốc (Markdown).";

  const prompt = `
${userInstruction}
Đoạn văn: "${text}"

Trả về KẾT QUẢ DUY NHẤT LÀ JSON (không giải thích thêm) theo định dạng sau:
{
  "rewritten_text": "Kết quả sau khi xử lý"
}
  `;

  return await callGemini(prompt, systemPrompt);
}

module.exports = {
  analyzeGrammar,
  analyzeTone,
  analyzeRewrite,
};
