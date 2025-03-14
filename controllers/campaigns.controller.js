import { getGeminiResponse } from '../service/ai/gemini.service.js';
import dotenv from "dotenv";

dotenv.config();

export const getAIResponse = async (req, res) => {
  try {
    const { message, modelType } = req.body;
    console.log(message);
    if (!message) return res.status(400).json({ error: "Message is required" });
    console.log('model:', modelType);
    
    const response = await getGeminiResponse(message, modelType || "gemini-pro");
    res.json(response);
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: error.message });
  }
};
