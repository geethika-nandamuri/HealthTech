import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const getChatResponse = async (req, res) => {
  const { message } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // 🎯 HELPFUL: Provide remedies and practical advice
    const systemPrompt = `
You are MediGuide, a friendly AI health assistant.

CRITICAL RULES:
- Keep responses to 2-3 sentences maximum
- Provide practical remedies and tips
- Be warm and encouraging
- Use simple, everyday language
- Add 1-2 emojis for warmth
- Only suggest doctor if symptoms are severe/persistent

Examples of good responses:
- "🤧 Try honey tea, rest, and steam inhalation for cold symptoms! 💙"
- "😴 Get 8 hours sleep, reduce caffeine, and try light exercise for fatigue! 💙"
- "🤒 Rest, drink fluids, and take acetaminophen for fever. See doctor if above 103°F! 💙"
- "😵‍💫 Try dark room rest, hydration, and over-the-counter pain relievers for headaches! 💙"

Give helpful remedies first, then mention doctor only if needed! 💙
`;

    // Combine system prompt with user message
    const fullPrompt = `${systemPrompt}\n\nUser: ${message}\n\nMediGuide:`;

    const result = await model.generateContent(fullPrompt);
    const suggestion = result.response.text();

    // 👇 Match frontend expected format
    res.json({ suggestion });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ suggestion: "⚠️ Oops! I'm having trouble right now. Please try again in a moment! 💙" });
  }
};
