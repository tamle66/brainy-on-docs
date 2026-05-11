require('dotenv').config({ path: '../.env' });
const { analyzeRewrite } = require('./aiService');

async function runTest() {
  console.log('Testing proxy connection...');
  try {
    const text = 'Hom nay la 1 ngay dep troi.';
    const context = null;
    const systemPrompt = 'Bạn là chuyên gia ngôn ngữ, hãy sửa lỗi chính tả.';
    
    console.log('Sending request to proxy...');
    const result = await analyzeRewrite(text, context, systemPrompt);
    console.log('--- SUCCESS ---');
    console.log('Result:', result);
  } catch (error) {
    console.error('--- ERROR ---');
    console.error(error.message);
  }
}

runTest();
