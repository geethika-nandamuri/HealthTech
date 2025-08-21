import { Router } from 'express'
import { createReminder, listReminders } from '../controllers/reminders.controller.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
router.get('/', requireAuth, listReminders)
router.post('/', requireAuth, createReminder)
export default router



