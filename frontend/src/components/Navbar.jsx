import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import logo from '../assets/mediguide-logo.svg'

export default function Navbar(){
  const { user, logout } = useAuth()
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path
  
  return (
    <nav className="navbar">
      <div className="nav-inner">
        <div className="brand">
          <img src={logo} alt="MediGuide" className="brand-logo" />
          <span>MediGuide</span>
          <span className="brand-badge">beta</span>
        </div>
        
        <div className="nav-links">
          {!user && (
            <>
              <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
                <span className="nav-icon">🔐</span>
                Login
              </Link>
              <Link to="/register" className={`nav-link ${isActive('/register') ? 'active' : ''}`}>
                <span className="nav-icon">📝</span>
                Register
              </Link>
            </>
          )}
          
          {user && user.role === 'patient' && (
            <>
              <Link to="/patient" className={`nav-link ${isActive('/patient') ? 'active' : ''}`}>
                <span className="nav-icon">🏠</span>
                Home
              </Link>
              <Link to="/patient/appointments" className={`nav-link ${isActive('/patient/appointments') ? 'active' : ''}`}>
                <span className="nav-icon">📅</span>
                Appointments
              </Link>
              <Link to="/patient/reminders" className={`nav-link ${isActive('/patient/reminders') ? 'active' : ''}`}>
                <span className="nav-icon">⏰</span>
                Reminders
              </Link>
            </>
          )}
          
          {user && user.role === 'doctor' && (
            <>
              <Link to="/doctor" className={`nav-link ${isActive('/doctor') ? 'active' : ''}`}>
                <span className="nav-icon">📊</span>
                Dashboard
              </Link>
              <Link to="/doctor/patients" className={`nav-link ${isActive('/doctor/patients') ? 'active' : ''}`}>
                <span className="nav-icon">👥</span>
                Patients
              </Link>
              <Link to="/doctor/appointments" className={`nav-link ${isActive('/doctor/appointments') ? 'active' : ''}`}>
                <span className="nav-icon">📋</span>
                Appointments
              </Link>
              <Link to="/doctor/trends" className={`nav-link ${isActive('/doctor/trends') ? 'active' : ''}`}>
                <span className="nav-icon">📈</span>
                Trends
              </Link>
            </>
          )}
          
          {user && (
            <div className="user-section">
              <div className="user-info">
                <span className="user-avatar">👤</span>
                <span className="user-name">{user.name}</span>
              </div>
              <button className="btn secondary logout-btn" onClick={logout}>
                <span className="nav-icon">🚪</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}






