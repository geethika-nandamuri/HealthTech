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
import healthRecordRoutes from "./routes/healthRecords.routes.js";

const app = express()
const port = process.env.PORT || 5700

app.use(cors())
app.use(express.json())

app.get('/', (_, res) => res.json({ ok: true, message: "Backend root working" }))
app.get('/health', (_, res) => res.json({ ok: true }))

// Test endpoint to verify MongoDB connection
app.get('/api/test-mongo', async (_, res) => {
  try {
    const dbState = mongoose.connection.readyState
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }
    
    res.json({ 
      ok: true, 
      message: "MongoDB connection test",
      connection: states[dbState],
      database: mongoose.connection.name,
      collections: Object.keys(mongoose.connection.collections)
    })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

// ✅ all routes prefixed with /api
app.use('/api/auth', authRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/reminders', reminderRoutes)
app.use('/api/symptoms', symptomRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/health-records', healthRecordRoutes)

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected')
  app.listen(port, () => console.log(`API running on :${port}`))
}).catch((err) => {
  console.error('Mongo connection failed', err)
  process.exit(1)
})
