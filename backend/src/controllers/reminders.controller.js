import Reminder from '../models/Reminder.js'
import User from '../models/User.js'

// Simple email notification function (replace with actual email service)
async function sendEmailNotification(userEmail, reminderText, reminderTime) {
  console.log(`📧 Email notification sent to ${userEmail}:`)
  console.log(`   Reminder: ${reminderText}`)
  console.log(`   Time: ${reminderTime}`)
  console.log(`   Subject: MediGuide Reminder`)
  console.log(`   Body: Don't forget: ${reminderText} at ${reminderTime}`)
  
  // TODO: Integrate with actual email service like:
  // - Nodemailer with Gmail/SMTP
  // - SendGrid
  // - AWS SES
  // - Resend.com
}

export async function listReminders(req, res){
  const userId = req.currentUser?._id || req.user?.id
  const items = await Reminder.find({ userId })
  return res.json(items.map(r => ({ id: r._id, userId: r.userId, text: r.text, time: r.time })))
}

export async function createReminder(req, res){
  const userId = req.currentUser?._id || req.user?.id
  const { text, time } = req.body
  if(!text || !time) return res.status(400).json({ message: 'Missing fields' })
  
  try {
    const created = await Reminder.create({ userId, text, time })
    
    // Send email notification
    const user = await User.findById(userId)
    if (user && user.email) {
      await sendEmailNotification(user.email, text, time)
    }
    
    return res.status(201).json({ 
      id: created._id, 
      userId: created.userId, 
      text: created.text, 
      time: created.time,
      emailSent: true
    })
  } catch (error) {
    console.error('Error creating reminder:', error)
    return res.status(500).json({ message: 'Failed to create reminder' })
  }
}



