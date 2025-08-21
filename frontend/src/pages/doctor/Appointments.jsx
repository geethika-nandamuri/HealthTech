import { useEffect, useState } from 'react'
import { apiClient } from '../../services/apiClient.js'

export default function DoctorAppointments(){
  const [items, setItems] = useState([])
  const load = async () => setItems(await apiClient.get('/appointments'))
  useEffect(() => { load() }, [])
  return (
    <div className="card">
      <h3>Appointments</h3>
      <table className="table">
        <thead><tr><th>When</th><th>Patient</th><th>Reason</th><th>Status</th></tr></thead>
        <tbody>
          {items.map(a => (
            <tr key={a.id}>
              <td>{new Date(a.datetime).toLocaleString()}</td>
              <td>{a.patientId}</td>
              <td>{a.reason}</td>
              <td><span className="pill">{a.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}






