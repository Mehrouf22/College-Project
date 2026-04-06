import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import dotenv from 'dotenv';
dotenv.config();

async function test(modelName) {
  try {
    const model = new ChatGoogleGenerativeAI({
      model: modelName,
      apiKey: process.env.GOOGLE_API_KEY
    });
    console.log(`Testing ${modelName}...`);
    const res = await model.invoke("Hello");
    console.log("SUCCESS:", res.content);
  } catch (err) {
    console.error(`FAIL [${modelName}]:`, err.message);
  }
}

async function run() {
  await test('gemini-1.5-flash');
  await test('gemini-1.5-pro');
  await test('gemini-pro');
}
run();
