import { getGeminiResponse } from '../service/ai/gemini.service.js';
import dotenv from "dotenv";

dotenv.config();

export const getAIResponse = async (req, res) => {
  try {
    const { message, modelType } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });
    
    const response = await getGeminiResponse(message, modelType || "gemini-pro");
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
