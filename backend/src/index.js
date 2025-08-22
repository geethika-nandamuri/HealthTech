import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import authRoutes from './routes/auth.routes.js'
import patientRoutes from './routes/patients.routes.js'
import appointmentRoutes from './routes/appointments.routes.js'
import reminderRoutes from './routes/reminders.routes.js'
import symptomRoutes from './routes/symptoms.routes.js'
import chatRoutes from './routes/chat.routes.js'

const app = express()
const port = process.env.PORT || 5700

app.use(cors())
app.use(express.json())

// ✅ Root route (important for Render health check)
app.get("/", (_, res) => res.send("Backend is running 🚀"))

// ✅ Health check route
app.get("/health", (_, res) => res.json({ ok: true }))

app.use('/auth', authRoutes)
app.use('/patients', patientRoutes)
app.use('/appointments', appointmentRoutes)
app.use('/reminders', reminderRoutes)
app.use('/symptoms', symptomRoutes)
app.use('/api/chat', chatRoutes)

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected')
  app.listen(port, () => console.log(`API running on :${port}`))
}).catch((err) => {
  console.error('Mongo connection failed', err)
  process.exit(1)
})
