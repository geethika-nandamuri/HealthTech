import { useEffect, useState } from 'react'
import { apiClient } from '../../services/apiClient.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function PatientAppointments(){
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [datetime, setDatetime] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  const load = async () => {
    try { setItems(await apiClient.get('/appointments')) } catch(e) { setError('Failed to load appointments') }
  }
  useEffect(() => { load() }, [])

  const book = async () => {
    setError('')
    try {
      await apiClient.post('/appointments', { patientId: user.id, datetime, reason })
      setDatetime(''); setReason(''); load()
    } catch (e) { setError('Booking failed') }
  }

  return (
    <div className="grid">
      <div className="card">
        <h3>Book appointment</h3>
        {error && <p style={{ color: '#fca5a5' }}>{error}</p>}
        <label className="label">Date/time</label>
        <input className="input" type="datetime-local" value={datetime} onChange={e => setDatetime(e.target.value)} />
        <label className="label">Reason</label>
        <input className="input" value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g., fever and cough" />
        <div className="space" />
        <button className="btn" onClick={book}>Book</button>
      </div>
      <div className="card">
        <h3>Your appointments</h3>
        <table className="table">
          <thead><tr><th>When</th><th>Reason</th><th>Status</th></tr></thead>
          <tbody>
            {items.filter(a => a.patientId === user.id).map(a => (
              <tr key={a.id}><td>{new Date(a.datetime).toLocaleString()}</td><td>{a.reason}</td><td>{a.status}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}






