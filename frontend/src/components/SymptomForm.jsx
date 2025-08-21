import { useState } from 'react'
import { apiClient } from '../services/apiClient.js'

export default function SymptomForm(){
  const [symptoms, setSymptoms] = useState('Fever and cough')
  const [duration, setDuration] = useState('2 days')
  const [severity, setSeverity] = useState('moderate')
  const [suggestion, setSuggestion] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    await apiClient.post('/symptoms', { symptoms, duration, severity })
    const res = await apiClient.post('/symptoms/analyze', { symptoms })
    setSuggestion(res.suggestion)
  }

  return (
    <div className="card">
      <h3>Report symptoms</h3>
      <form onSubmit={submit}>
        <label className="label">Symptoms</label>
        <input className="input" value={symptoms} onChange={e => setSymptoms(e.target.value)} />
        <label className="label">Duration</label>
        <input className="input" value={duration} onChange={e => setDuration(e.target.value)} />
        <label className="label">Severity</label>
        <select className="input" value={severity} onChange={e => setSeverity(e.target.value)}>
          <option value="mild">Mild</option>
          <option value="moderate">Moderate</option>
          <option value="severe">Severe</option>
        </select>
        <div className="space" />
        <button className="btn">Submit</button>
      </form>
      {suggestion && <>
        <div className="space" />
        <div className="pill">Suggestion</div>
        <p>{suggestion}</p>
      </>}
    </div>
  )
}






