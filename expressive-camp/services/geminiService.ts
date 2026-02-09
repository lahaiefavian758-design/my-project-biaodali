
import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosisResult, TrainingFeedback } from "../types";

/**
 * -------------------------------------------------------------------------
 * 配置区域：使用 Google GenAI SDK
 * -------------------------------------------------------------------------
 */

// Initializing the Google GenAI client using the environment variable API_KEY.
const ai = new GoogleGenAI({ 
  apiKey: "sk-FUkJCWag8VyHoibpNjGeZ0T1iyqPJpyELpkE9anbUVzKazWq", 
  baseUrl: "https://api.zscc.in/v1" });
export const getDiagnosisAnalysis = async (answers: string[]): Promise<DiagnosisResult> => {
  // Use gemini-3-pro-preview for advanced reasoning and multi-step tasks.
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `
    作为职场表达力导师，请深度分析以下回答：
    1. 自我介绍: ${answers[0]}
    2. 专业解释: ${answers[1]}
    3. 成果描述: ${answers[2]}

    请严格以 JSON 格式返回评分（0-100）和建议。
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scores: {
            type: Type.OBJECT,
            properties: {
              clarity: { type: Type.NUMBER },
              logic: { type: Type.NUMBER },
              persuasion: { type: Type.NUMBER },
              passion: { type: Type.NUMBER },
              conciseness: { type: Type.NUMBER },
            },
            required: ["clarity", "logic", "persuasion", "passion", "conciseness"],
          },
          level: { type: Type.STRING },
          weakness: { type: Type.STRING },
          suggestion: { type: Type.STRING },
          prescription: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ["scores", "level", "weakness", "suggestion", "prescription"],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("模型响应为空");
  }
  
  return JSON.parse(text) as DiagnosisResult;
};

export const getTrainingFeedback = async (
  scenarioName: string,
  taskTitle: string,
  background: string,
  answer: string
): Promise<TrainingFeedback> => {
  // Use gemini-3-pro-preview for high-quality feedback and structured output.
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `
    分析以下职场沟通练习：
    场景: ${scenarioName}
    任务: ${taskTitle}
    背景: ${background}
    回答: ${answer}
    
    请给出 PREP 点评（Point, Reason, Example, Point）。
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          good: { type: Type.ARRAY, items: { type: Type.STRING } },
          improve: { type: Type.ARRAY, items: { type: Type.STRING } },
          tip: { type: Type.STRING },
          score: { type: Type.NUMBER },
        },
        required: ["good", "improve", "tip", "score"],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("模型响应为空");
  }
  
  return JSON.parse(text) as TrainingFeedback;
};

export const searchKnowledge = async (query: string): Promise<string> => {
  // Use gemini-3-flash-preview for simple Q&A and knowledge retrieval.
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `请回答关于“${query}”的沟通技巧。`,
  });
  return response.text || "未能找到相关知识点。";
};
