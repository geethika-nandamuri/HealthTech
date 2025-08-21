import mongoose from 'mongoose'

const symptomReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symptoms: { type: String, required: true },
  duration: { type: String },
  severity: { type: String, enum: ['mild', 'moderate', 'severe'], default: 'mild' }
}, { timestamps: true })

export default mongoose.model('SymptomReport', symptomReportSchema)



