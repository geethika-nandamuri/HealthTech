import mongoose from "mongoose";

const healthRecordSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String 
    },
    recordType: {
      type: String,
      enum: ['appointment', 'prescription', 'labReport', 'vaccination', 'surgery', 'allergy', 'chronic', 'other'],
      default: 'other'
    },
    category: {
      type: String,
      enum: ['automatic', 'manual'],
      default: 'manual'
    },
    date: { 
      type: Date, 
      default: Date.now 
    },
    // For future enhancements
    attachments: [{
      filename: String,
      url: String,
      type: String
    }],
    tags: [String],
    isPrivate: {
      type: Boolean,
      default: false
    }
  },
  { 
    timestamps: true,
    // Index for efficient queries
    indexes: [
      { patientId: 1, date: -1 },
      { patientId: 1, category: 1 },
      { patientId: 1, recordType: 1 }
    ]
  }
);

export default mongoose.model("HealthRecord", healthRecordSchema);
