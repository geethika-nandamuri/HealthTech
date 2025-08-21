import { Router } from 'express'
import { analyzeSymptoms, submitSymptoms } from '../controllers/symptoms.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.post('/', requireAuth, submitSymptoms)
router.post('/analyze', analyzeSymptoms)
export default router



