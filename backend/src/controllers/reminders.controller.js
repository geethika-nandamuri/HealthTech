import Reminder from '../models/Reminder.js'

export async function listReminders(req, res){
  const userId = req.currentUser?._id || req.user?.id
  const items = await Reminder.find({ userId })
  return res.json(items.map(r => ({ id: r._id, userId: r.userId, text: r.text, time: r.time })))
}

export async function createReminder(req, res){
  const userId = req.currentUser?._id || req.user?.id
  const { text, time } = req.body
  if(!text || !time) return res.status(400).json({ message: 'Missing fields' })
  const created = await Reminder.create({ userId, text, time })
  return res.status(201).json({ id: created._id, userId: created.userId, text: created.text, time: created.time })
}



