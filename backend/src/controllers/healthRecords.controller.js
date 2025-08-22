import HealthRecord from '../models/healthRecord.model.js'
import Appointment from '../models/Appointment.js'

// Get all health records for the authenticated user
export const getHealthRecords = async (req, res) => {
  try {
    console.log('🔍 Fetching health records for user:', req.currentUser._id)
    const userId = req.currentUser._id
    
    // Get manual records from database
    const manualRecords = await HealthRecord.find({ patientId: userId })
      .sort({ date: -1 })
      .lean()
    
    console.log('📋 Found manual records:', manualRecords.length)
    
    // Get automatic records (appointments, prescriptions, etc.)
    const automaticRecords = await generateAutomaticRecords(userId)
    
    console.log('🤖 Found automatic records:', automaticRecords.length)
    
    // Combine and format all records
    const allRecords = [
      ...automaticRecords,
      ...manualRecords.map(record => ({
        id: record._id,
        title: record.title,
        description: record.description,
        category: 'manual',
        recordType: record.recordType || 'other',
        date: record.date,
        createdAt: record.createdAt
      }))
    ]
    
    // Sort by date (newest first)
    allRecords.sort((a, b) => new Date(b.date) - new Date(a.date))
    
    console.log('✅ Total health records returned:', allRecords.length)
    res.json(allRecords)
  } catch (error) {
    console.error('❌ Error fetching health records:', error)
    res.status(500).json({ message: 'Failed to fetch health records' })
  }
}

// Create a new manual health record
export const createHealthRecord = async (req, res) => {
  try {
    console.log('➕ Creating new health record for user:', req.currentUser._id)
    console.log('📝 Record data:', req.body)
    
    const userId = req.currentUser._id
    const { title, description, recordType = 'other' } = req.body
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' })
    }
    
    const newRecord = new HealthRecord({
      patientId: userId,
      title,
      description,
      recordType,
      date: new Date(),
      category: 'manual'
    })
    
    const savedRecord = await newRecord.save()
    console.log('✅ Health record saved to MongoDB:', savedRecord._id)
    
    res.status(201).json({
      id: savedRecord._id,
      title: savedRecord.title,
      description: savedRecord.description,
      category: 'manual',
      recordType: savedRecord.recordType,
      date: savedRecord.date,
      createdAt: savedRecord.createdAt
    })
  } catch (error) {
    console.error('❌ Error creating health record:', error)
    res.status(500).json({ message: 'Failed to create health record' })
  }
}

// Update a manual health record
export const updateHealthRecord = async (req, res) => {
  try {
    const userId = req.currentUser._id
    const { id } = req.params
    const { title, description, recordType } = req.body
    
    const record = await HealthRecord.findOne({ _id: id, patientId: userId })
    
    if (!record) {
      return res.status(404).json({ message: 'Health record not found' })
    }
    
    // Only allow updating manual records
    if (record.category !== 'manual') {
      return res.status(403).json({ message: 'Cannot edit system-generated records' })
    }
    
    const updatedRecord = await HealthRecord.findByIdAndUpdate(
      id,
      { title, description, recordType },
      { new: true }
    )
    
    res.json({
      id: updatedRecord._id,
      title: updatedRecord.title,
      description: updatedRecord.description,
      category: 'manual',
      recordType: updatedRecord.recordType,
      date: updatedRecord.date,
      createdAt: updatedRecord.createdAt
    })
  } catch (error) {
    console.error('Error updating health record:', error)
    res.status(500).json({ message: 'Failed to update health record' })
  }
}

// Delete a manual health record
export const deleteHealthRecord = async (req, res) => {
  try {
    const userId = req.currentUser._id
    const { id } = req.params
    
    const record = await HealthRecord.findOne({ _id: id, patientId: userId })
    
    if (!record) {
      return res.status(404).json({ message: 'Health record not found' })
    }
    
    // Only allow deleting manual records
    if (record.category !== 'manual') {
      return res.status(403).json({ message: 'Cannot delete system-generated records' })
    }
    
    await HealthRecord.findByIdAndDelete(id)
    
    res.json({ message: 'Health record deleted successfully' })
  } catch (error) {
    console.error('Error deleting health record:', error)
    res.status(500).json({ message: 'Failed to delete health record' })
  }
}

// Generate automatic records from appointments and other system data
const generateAutomaticRecords = async (userId) => {
  const automaticRecords = []
  
  try {
    // Get appointments and convert to health records
    const appointments = await Appointment.find({ patientId: userId })
      .sort({ datetime: -1 })
      .lean()
    
    appointments.forEach(appointment => {
      automaticRecords.push({
        id: `appt_${appointment._id}`,
        title: `Appointment - ${appointment.reason || 'General Checkup'}`,
        description: `Appointment scheduled for ${new Date(appointment.datetime).toLocaleDateString()} at ${new Date(appointment.datetime).toLocaleTimeString()}. Status: ${appointment.status}`,
        category: 'automatic',
        recordType: 'appointment',
        date: appointment.datetime,
        createdAt: appointment.createdAt
      })
    })
    
    // TODO: Add more automatic record types
    // - Prescriptions from pharmacy integration
    // - Lab results from lab integration
    // - Vaccination records from immunization registry
    // - Insurance claims and billing records
    
  } catch (error) {
    console.error('Error generating automatic records:', error)
  }
  
  return automaticRecords
}
