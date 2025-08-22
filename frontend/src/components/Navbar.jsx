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
          <img src={logo} alt="MediGuide Logo" className="brand-logo" />
          <span>MediGuide</span>
          <span className="brand-badge">beta</span>
        </div>

        {user && (
          <div className="nav-links">
            {user.role === 'patient' && (
              <>
                <Link 
                  to="/patient" 
                  className={`nav-link ${isActive('/patient') ? 'active' : ''}`}
                >
                  <span className="nav-icon">🏠</span>
                  Dashboard
                </Link>
                <Link 
                  to="/patient/appointments" 
                  className={`nav-link ${isActive('/patient/appointments') ? 'active' : ''}`}
                >
                  <span className="nav-icon">📅</span>
                  Appointments
                </Link>
                <Link 
                  to="/patient/reminders" 
                  className={`nav-link ${isActive('/patient/reminders') ? 'active' : ''}`}
                >
                  <span className="nav-icon">⏰</span>
                  Reminders
                </Link>
                <Link 
                  to="/patient/health-records" 
                  className={`nav-link ${isActive('/patient/health-records') ? 'active' : ''}`}
                >
                  <span className="nav-icon">📋</span>
                  Health Records
                </Link>
              </>
            )}
            
            {user.role === 'doctor' && (
              <>
                <Link 
                  to="/doctor" 
                  className={`nav-link ${isActive('/doctor') ? 'active' : ''}`}
                >
                  <span className="nav-icon">🏠</span>
                  Dashboard
                </Link>
                <Link 
                  to="/doctor/patients" 
                  className={`nav-link ${isActive('/doctor/patients') ? 'active' : ''}`}
                >
                  <span className="nav-icon">👥</span>
                  Patients
                </Link>
                <Link 
                  to="/doctor/appointments" 
                  className={`nav-link ${isActive('/doctor/appointments') ? 'active' : ''}`}
                >
                  <span className="nav-icon">📅</span>
                  Appointments
                </Link>
                <Link 
                  to="/doctor/trends" 
                  className={`nav-link ${isActive('/doctor/trends') ? 'active' : ''}`}
                >
                  <span className="nav-icon">📊</span>
                  Trends
                </Link>
              </>
            )}
          </div>
        )}

        {user && (
          <div className="user-section">
            <div className="user-info">
              <span className="user-avatar">👤</span>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-email">{user.email}</span>
              </div>
            </div>
            <div className="user-actions">
              <Link to="/patient/profile" className="nav-link">
                <span className="nav-icon">⚙️</span>
                Profile
              </Link>
              <button onClick={logout} className="logout-btn">
                <span className="nav-icon">🚪</span>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}






