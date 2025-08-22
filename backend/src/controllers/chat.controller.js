import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const getChatResponse = async (req, res) => {
  const { message } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(message);
    const suggestion = result.response.text();

    // 👇 Match frontend expected format
    res.json({ suggestion });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ suggestion: "⚠️ Chatbot failed. Try again later." });
  }
};
