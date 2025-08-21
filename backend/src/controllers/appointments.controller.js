import Appointment from '../models/Appointment.js'

export async function listAppointments(_req, res){
  const items = await Appointment.find().sort({ createdAt: -1 })
  return res.json(items.map(a => ({ id: a._id, patientId: a.patientId, doctorId: a.doctorId, datetime: a.datetime, reason: a.reason, status: a.status })))
}

export async function createAppointment(req, res){
  const { patientId, datetime, reason } = req.body
  if(!patientId || !datetime) return res.status(400).json({ message: 'Missing fields' })
  const doctorId = req.currentUser?.role === 'doctor' ? req.currentUser._id : null
  const docId = doctorId || null
  const created = await Appointment.create({ patientId, doctorId: docId, datetime, reason })
  return res.status(201).json({ id: created._id, patientId: created.patientId, doctorId: created.doctorId, datetime: created.datetime, reason: created.reason, status: created.status })
}



