
import { GoogleGenAI } from "@google/genai";
import { TOPIC_REGISTRY } from "../constants";
import { MathTopic } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendMessageStream = async (
  message: string,
  currentTopic: MathTopic,
  currentStepTitle: string,
  visualStateStr: string,
  history: { role: 'user' | 'model', content: string }[] = []
) => {
  const ai = getAI();
  const manifest = TOPIC_REGISTRY[currentTopic];
  const topicPrompt = manifest?.aiSystemPrompt || "引导用户理解数学直觉。";
  
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `你是一个名为「直觉数学建筑师」的 AI 导师。
遵循 3Blue1Brown 的风格：直观、优雅、侧重几何联系。
当前主题教学策略：${topicPrompt}
当前步骤：${currentStepTitle}
当前图形状态：${visualStateStr}
请根据图像和步骤逻辑回答用户，避免枯燥的代数，多谈论“图像上的变化”。`,
    },
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.content }]
    })),
  });

  return chat.sendMessageStream({ message });
};
