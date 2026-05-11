require('dotenv').config({ path: '../.env' });
const axios = require('axios');

const {
  AIPROXY_HEADER_AUTH_NAME,
  AIPROXY_HEADER_AUTH_VALUE,
} = process.env;

const proxyUrl = 'https://aiproxy.jemmia.vn/v1/chat/completions';

/**
 * Call AI Proxy
 */
async function callGemini(prompt, systemPrompt = null) {
  try {
    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const payload = {
      model: 'gemini-2.5-flash-lite',
      messages: messages,
    };

    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (AIPROXY_HEADER_AUTH_NAME && AIPROXY_HEADER_AUTH_VALUE) {
      headers[AIPROXY_HEADER_AUTH_NAME] = AIPROXY_HEADER_AUTH_VALUE;
    }

    const response = await axios.post(proxyUrl, payload, { headers });

    const resultText = response.data.choices[0].message.content;
    
    // Clean potential markdown code blocks (```json ... ```)
    const cleanedText = resultText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('AI Proxy Error:', error.response ? JSON.stringify(error.response.data) : error.message);
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
async function analyzeRewrite(text, context = null, systemPrompt = null, userPrompt = null) {
  let finalInstruction = "Hãy viết lại đoạn văn sau sao cho hay hơn, chuyên nghiệp hơn. Tôn trọng định dạng gốc (Markdown).";
  
  if (systemPrompt && userPrompt) {
    finalInstruction = `Chỉ thị hệ thống: ${systemPrompt}\nYêu cầu thêm của người dùng: ${userPrompt}\nHãy kết hợp cả hai để viết lại đoạn văn. Bảo lưu định dạng Markdown.`;
  } else if (systemPrompt) {
    finalInstruction = `Chỉ thị hệ thống: ${systemPrompt}\nThực hiện theo chỉ thị. Bảo lưu định dạng Markdown.`;
  } else if (userPrompt) {
    finalInstruction = `Yêu cầu: ${userPrompt}\nBảo lưu định dạng Markdown.`;
  }

  const contextBlock = context ? `\n\n--- NGỮ CẢNH TÀI LIỆU (CHỈ DÙNG ĐỂ THAM KHẢO TỪ VỰNG/Ý NGHĨA, KHÔNG XỬ LÝ PHẦN NÀY) ---\n${context}\n-----------------------------------\n` : '';

  const prompt = `
${finalInstruction}${contextBlock}

--- ĐOẠN VĂN MỤC TIÊU (BẮT BUỘC CHỈ XỬ LÝ ĐÚNG ĐOẠN NÀY) ---
"${text}"
-------------------------------------------------------------

Trả về KẾT QUẢ DUY NHẤT LÀ JSON (không giải thích thêm) theo định dạng sau:
{
  "rewritten_text": "Kết quả sau khi xử lý đoạn văn mục tiêu"
}
  `;

  return await callGemini(prompt, systemPrompt);
}

module.exports = {
  analyzeGrammar,
  analyzeTone,
  analyzeRewrite,
};
