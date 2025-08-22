import SymptomReport from '../models/SymptomReport.js'
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

export async function submitSymptoms(req, res) {
  const userId = req.currentUser?._id || req.user?.id
  const { symptoms, duration, severity } = req.body
  if (!symptoms) return res.status(400).json({ message: 'Missing symptoms' })

  const created = await SymptomReport.create({
    userId,
    symptoms,
    duration,
    severity
  })

  return res.status(201).json({
    id: created._id,
    userId: created.userId,
    symptoms: created.symptoms,
    duration: created.duration,
    severity: created.severity,
    createdAt: created.createdAt
  })
}

export async function analyzeSymptoms(req, res) {
  try {
    const { symptoms } = req.body
    if (!symptoms) return res.status(400).json({ suggestion: 'No symptoms provided' })

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // 🎯 HELPFUL: Provide remedies and practical advice for symptoms
    const systemPrompt = `
You are MediGuide, a caring AI health assistant.

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

    const fullPrompt = `${systemPrompt}\n\nPatient reports: ${symptoms}\n\nMediGuide's advice:`

    const result = await model.generateContent(fullPrompt)
    const suggestion = result.response.text()

    return res.json({ suggestion })
  } catch (err) {
    console.error("AI Error:", err)
    return res.status(500).json({ suggestion: "⚠️ I'm having trouble analyzing symptoms right now. Please try again or consult a doctor! 💙" })
  }
}
