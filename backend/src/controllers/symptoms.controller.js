import SymptomReport from '../models/SymptomReport.js'
import { analyzeSymptomsText } from '../utils/analyzer.js'

export async function submitSymptoms(req, res){
  const userId = req.currentUser?._id || req.user?.id
  const { symptoms, duration, severity } = req.body
  if(!symptoms) return res.status(400).json({ message: 'Missing symptoms' })
  const created = await SymptomReport.create({ userId, symptoms, duration, severity })
  return res.status(201).json({ id: created._id, userId: created.userId, symptoms: created.symptoms, duration: created.duration, severity: created.severity, createdAt: created.createdAt })
}

export async function analyzeSymptoms(req, res){
  const { symptoms } = req.body
  const suggestion = analyzeSymptomsText(symptoms)
  return res.json({ suggestion })
}



