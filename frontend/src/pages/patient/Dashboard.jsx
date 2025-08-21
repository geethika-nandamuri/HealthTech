import Chatbot from '../../components/Chatbot.jsx'
import SymptomForm from '../../components/SymptomForm.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function PatientDashboard(){
  const { user } = useAuth()
  return (
    <div className="grid three">
      <div className="card">
        <h3>Welcome, {user?.name || 'Patient'}</h3>
        <p className="label">Quick actions</p>
        <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
          <a className="pill" href="/patient/appointments">Book appointment</a>
          <a className="pill" href="/patient/reminders">Set reminder</a>
        </div>
      </div>
      <Chatbot />
      <SymptomForm />
    </div>
  )
}






