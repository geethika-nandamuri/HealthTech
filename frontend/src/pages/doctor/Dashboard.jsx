import { useEffect, useMemo, useState } from 'react'
import { apiClient } from '../../services/apiClient.js'

export default function DoctorDashboard(){
  const [patients, setPatients] = useState([])
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    Promise.all([apiClient.get('/patients'), apiClient.get('/appointments')]).then(([p, a]) => {
      setPatients(p); setAppointments(a)
    })
  }, [])

  const trends = useMemo(() => {
    const weekCounts = {}
    for (const a of appointments) {
      const key = new Date(a.datetime).toDateString()
      weekCounts[key] = (weekCounts[key] || 0) + 1
    }
    return Object.entries(weekCounts).map(([date, count]) => ({ date, count }))
  }, [appointments])

  return (
    <div className="grid three">
      <div className="card">
        <h3>Patients</h3>
        <p className="label">Total: {patients.length}</p>
      </div>
      <div className="card">
        <h3>Appointments</h3>
        <p className="label">Total: {appointments.length}</p>
      </div>
      <div className="card">
        <h3>This week</h3>
        <ul>
          {trends.map(t => <li key={t.date}>{t.date}: {t.count}</li>)}
        </ul>
      </div>
    </div>
  )
}






