import { useEffect, useState } from 'react'
import { apiClient } from '../../services/apiClient.js'

export default function DoctorTrends(){
  const [appointments, setAppointments] = useState([])
  useEffect(() => { apiClient.get('/appointments').then(setAppointments) }, [])

  const counts = appointments.reduce((acc, a) => {
    const d = new Date(a.datetime).toDateString()
    acc[d] = (acc[d] || 0) + 1
    return acc
  }, {})

  return (
    <div className="card">
      <h3>Community trends</h3>
      <p className="label">Appointments per day</p>
      <ul>
        {Object.entries(counts).map(([d,c]) => <li key={d}>{d}: {c}</li>)}
      </ul>
    </div>
  )
}






