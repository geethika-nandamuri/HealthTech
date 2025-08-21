import { Router } from 'express'
import { listPatients } from '../controllers/patients.controller.js'
import { requireAuth, requireRole } from '../middleware/auth.js'

const router = Router()
router.get('/', requireAuth, requireRole(['doctor','admin']), listPatients)
export default router



