import { useEffect, useState } from 'react'
import { apiClient } from '../../services/apiClient.js'

export default function PatientReminders(){
  const [items, setItems] = useState([])
  const [text, setText] = useState('Take medicine')
  const [time, setTime] = useState('21:00')

  const load = async () => { setItems(await apiClient.get('/reminders')) }
  useEffect(() => { load() }, [])

  const add = async () => {
    await apiClient.post('/reminders', { text, time })
    setText(''); setTime(''); load()
  }

  return (
    <div className="grid">
      <div className="card">
        <h3>Create reminder</h3>
        <label className="label">Text</label>
        <input className="input" value={text} onChange={e => setText(e.target.value)} />
        <label className="label">Time</label>
        <input className="input" type="time" value={time} onChange={e => setTime(e.target.value)} />
        <div className="space" />
        <button className="btn" onClick={add}>Add</button>
      </div>
      <div className="card">
        <h3>Your reminders</h3>
        <ul>
          {items.map(r => <li key={r.id}>{r.text} at {r.time}</li>)}
        </ul>
      </div>
    </div>
  )
}






