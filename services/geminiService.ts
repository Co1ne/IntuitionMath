
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

// Correctly use process.env.API_KEY directly as per Gemini API rules.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendMessage = async (
  message: string, 
  currentStep: string, 
  visualState: string,
  history: { role: 'user' | 'model', content: string }[] = []
) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `${SYSTEM_PROMPT}\n\n当前步骤状态: ${currentStep}\n当前图形状态: ${visualState}`,
      temperature: 0.7,
    },
    // Pass chat history to maintain conversation context.
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.content }]
    })),
  });

  const response = await chat.sendMessage({ message });
  // response.text is a property, not a method.
  return response.text;
};

export const sendMessageStream = async (
  message: string,
  currentStep: string,
  visualState: string,
  history: { role: 'user' | 'model', content: string }[] = []
) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `${SYSTEM_PROMPT}\n\n当前步骤状态: ${currentStep}\n当前图形状态: ${visualState}`,
    },
    // Pass chat history to maintain conversation context.
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.content }]
    })),
  });

  return chat.sendMessageStream({ message });
};
