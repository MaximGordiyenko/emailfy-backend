import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Get AI-generated response from Gemini.
 * @param {string} message - User's input message.
 * @param modelType - Set up desire model,
 * @returns {Promise<string>} - AI-generated response.
 */
export const getGeminiResponse = async (message, modelType) => {
  try {
    const model = genAI.getGenerativeModel({ model: `${modelType}` });
    const result = await model.generateContent(message);
    
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Gemini API request failed");
  }
};
