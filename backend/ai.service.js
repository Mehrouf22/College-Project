import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatMistralAI } from '@langchain/mistralai';
import { RunnableLambda } from "@langchain/core/runnables";
import dotenv from 'dotenv';
dotenv.config();

// 1. Content AI (Now using Mistral)
export const geminiModel = new ChatMistralAI({
  model: 'mistral-large-latest',
  apiKey: process.env.MISTRAL_API_KEY || ''
});

// 2. Component AI (Mistral)
export const mistralModel = new ChatMistralAI({
  model: 'mistral-large-latest',
  apiKey: process.env.MISTRAL_API_KEY || ''
});

// 3. Docs AI (Cohere - with custom proxy for stability)
const callCohereProxy = async (promptMessage) => {
  const promptText = typeof promptMessage === 'string' ? promptMessage : 
                    (typeof promptMessage?.toString === 'function' ? promptMessage.toString() : JSON.stringify(promptMessage));

  const response = await fetch('https://api.cohere.com/v1/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: promptText
    })
  });
  
  if (!response.ok) {
    throw new Error(`Cohere API Error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  
  return {
    content: data.text || "No response",
    _getType: () => 'ai'
  };
};

export const cohereModel = new RunnableLambda({ func: callCohereProxy });
