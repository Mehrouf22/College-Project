// AI Service Initialization
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatMistralAI } from '@langchain/mistralai';
import { ChatCohere } from '@langchain/cohere';
import dotenv from 'dotenv';
dotenv.config();

export const geminiModel = new ChatGoogleGenerativeAI({
  model: 'gemini-1.5-pro',
  maxOutputTokens: 2048,
  apiKey: process.env.GOOGLE_API_KEY || ''
});

export const mistralModel = new ChatMistralAI({
  model: 'mistral-large-latest',
});

export const cohereModel = new ChatCohere({
  model: 'command-r-plus',
});
