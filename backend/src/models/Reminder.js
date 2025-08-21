import mongoose from 'mongoose'

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  time: { type: String, required: true }
}, { timestamps: true })

export default mongoose.model('Reminder', reminderSchema)



