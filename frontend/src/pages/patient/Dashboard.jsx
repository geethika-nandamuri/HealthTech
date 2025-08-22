import Chatbot from '../../components/Chatbot.jsx'
import SymptomForm from '../../components/SymptomForm.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function PatientDashboard(){
  const { user } = useAuth()
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <div className="welcome-icon">👋</div>
          <div className="welcome-text">
            <h1>Welcome back, {user?.name || 'Patient'}!</h1>
            <p>How can we help you today?</p>
          </div>
        </div>
        <div className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <span className="stat-number">0</span>
              <span className="stat-label">Appointments</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <span className="stat-number">0</span>
              <span className="stat-label">Reminders</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid three">
        <div className="card welcome-card">
          <div className="card-header">
            <div className="card-icon">🏠</div>
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <a href="/patient/appointments" className="action-link">
              <span className="action-icon">📋</span>
              <div className="action-content">
                <span className="action-title">Book Appointment</span>
                <span className="action-desc">Schedule a visit with your doctor</span>
              </div>
              <span className="action-arrow">→</span>
            </a>
            <a href="/patient/reminders" className="action-link">
              <span className="action-icon">⏰</span>
              <div className="action-content">
                <span className="action-title">Set Reminders</span>
                <span className="action-desc">Manage medication reminders</span>
              </div>
              <span className="action-arrow">→</span>
            </a>
            <a href="/patient/health-records" className="action-link">
              <span className="action-icon">📊</span>
              <div className="action-content">
                <span className="action-title">Health Records</span>
                <span className="action-desc">View your medical history</span>
              </div>
              <span className="action-arrow">→</span>
            </a>
          </div>
        </div>
        
        <Chatbot />
        <SymptomForm />
      </div>
      
      <div className="dashboard-footer">
        <div className="health-tips">
          <h3>💡 Health Tips</h3>
          <ul>
            <li>Stay hydrated - drink 8 glasses of water daily</li>
            <li>Get 7-9 hours of sleep each night</li>
            <li>Exercise regularly for at least 30 minutes</li>
            <li>Don't skip your regular check-ups</li>
          </ul>
        </div>
      </div>
    </div>
  )
}






