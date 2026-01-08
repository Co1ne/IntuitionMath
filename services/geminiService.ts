
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

// Fix: Always use named parameter for apiKey and assume it exists in process.env.API_KEY
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendMessage = async (
  message: string, 
  currentStep: string, 
  visualState: string,
  history: { role: 'user' | 'model', content: string }[]
) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `${SYSTEM_PROMPT}\n\n当前步骤状态: ${currentStep}\n当前图形状态: ${visualState}`,
      temperature: 0.7,
    },
  });

  // Convert history to correct format if needed, but sendMessage handles it internally in many SDKs
  // For simplicity here, we use the basic message call.
  const response = await chat.sendMessage({ message });
  // Fix: response.text is a property, not a method
  return response.text;
};

export const sendMessageStream = async (
  message: string,
  currentStep: string,
  visualState: string
) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `${SYSTEM_PROMPT}\n\n当前步骤状态: ${currentStep}\n当前图形状态: ${visualState}`,
    },
  });

  return chat.sendMessageStream({ message });
};
