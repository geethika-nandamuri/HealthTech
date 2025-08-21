import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar(){
  const { user, logout } = useAuth()
  return (
    <nav className="navbar">
      <div className="nav-inner">
        <div className="brand">
          <span>CareLink</span>
          <span className="brand-badge">beta</span>
        </div>
        <div className="nav-links">
          {!user && <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>}
          {user && user.role === 'patient' && <>
            <Link to="/patient">Home</Link>
            <Link to="/patient/appointments">Appointments</Link>
            <Link to="/patient/reminders">Reminders</Link>
          </>}
          {user && user.role === 'doctor' && <>
            <Link to="/doctor">Dashboard</Link>
            <Link to="/doctor/patients">Patients</Link>
            <Link to="/doctor/appointments">Appointments</Link>
            <Link to="/doctor/trends">Trends</Link>
          </>}
          {user && <button className="btn secondary" onClick={logout}>Logout</button>}
        </div>
      </div>
    </nav>
  )
}






