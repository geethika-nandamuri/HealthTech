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

    const result = await model.generateContent(
      `The patient reports: ${symptoms}.
      Please suggest possible advice in very simple, non-technical language.`
    )

    const suggestion = result.response.text()

    return res.json({ suggestion })
  } catch (err) {
    console.error("AI Error:", err)
    return res.status(500).json({ suggestion: "Sorry, AI service is unavailable." })
  }
}
