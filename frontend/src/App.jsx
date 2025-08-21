import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import RoleRoute from './components/RoleRoute.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import PatientDashboard from './pages/patient/Dashboard.jsx'
import PatientAppointments from './pages/patient/Appointments.jsx'
import PatientReminders from './pages/patient/Reminders.jsx'
import DoctorDashboard from './pages/doctor/Dashboard.jsx'
import DoctorPatients from './pages/doctor/Patients.jsx'
import DoctorAppointments from './pages/doctor/Appointments.jsx'
import DoctorTrends from './pages/doctor/Trends.jsx'
import { useAuth } from './context/AuthContext.jsx'

function HomeRedirect() {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (user.role === 'doctor') return <Navigate to="/doctor" replace />
  return <Navigate to="/patient" replace />
}

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}> 
            <Route element={<RoleRoute allow={["patient"]} />}>
              <Route path="/patient" element={<PatientDashboard />} />
              <Route path="/patient/appointments" element={<PatientAppointments />} />
              <Route path="/patient/reminders" element={<PatientReminders />} />
            </Route>

            <Route element={<RoleRoute allow={["doctor"]} />}>
              <Route path="/doctor" element={<DoctorDashboard />} />
              <Route path="/doctor/patients" element={<DoctorPatients />} />
              <Route path="/doctor/appointments" element={<DoctorAppointments />} />
              <Route path="/doctor/trends" element={<DoctorTrends />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}






