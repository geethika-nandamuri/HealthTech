import { useState } from 'react'
import { apiClient } from '../services/apiClient.js'

export default function SymptomForm(){
  const [symptoms, setSymptoms] = useState('')
  const [duration, setDuration] = useState('')
  const [severity, setSeverity] = useState('moderate')
  const [suggestion, setSuggestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!symptoms.trim()) return
    
    setLoading(true)
    try {
      await apiClient.post('/symptoms', { symptoms, duration, severity })
      const res = await apiClient.post('/symptoms/analyze', { symptoms })
      setSuggestion(res.suggestion)
      setSubmitted(true)
    } catch (error) {
      setSuggestion('Sorry, there was an error processing your symptoms. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSymptoms('')
    setDuration('')
    setSeverity('moderate')
    setSuggestion('')
    setSubmitted(false)
  }

  return (
    <div className="card">
      <div className="form-header">
        <div className="form-icon">🏥</div>
        <h3>Symptom Report</h3>
      </div>
      
      <form onSubmit={submit} className="symptom-form">
        <div className="form-group">
          <label className="label">
            <span className="label-icon">💊</span>
            Symptoms
          </label>
          <textarea 
            className="input textarea" 
            value={symptoms} 
            onChange={e => setSymptoms(e.target.value)}
            placeholder="Describe your symptoms in detail..."
            rows="3"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label className="label">
              <span className="label-icon">⏰</span>
              Duration
            </label>
            <input 
              className="input" 
              value={duration} 
              onChange={e => setDuration(e.target.value)}
              placeholder="e.g., 2 days, 1 week"
            />
          </div>
          
          <div className="form-group">
            <label className="label">
              <span className="label-icon">📊</span>
              Severity
            </label>
            <select 
              className="input select" 
              value={severity} 
              onChange={e => setSeverity(e.target.value)}
            >
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn submit-btn" 
            disabled={loading || !symptoms.trim()}
          >
            {loading ? (
              <>
                <span className="loading-spinner">⏳</span>
                Analyzing...
              </>
            ) : (
              <>
                <span>🔍</span>
                Analyze Symptoms
              </>
            )}
          </button>
          
          {submitted && (
            <button 
              type="button" 
              className="btn secondary reset-btn" 
              onClick={resetForm}
            >
              <span>🔄</span>
              New Report
            </button>
          )}
        </div>
      </form>
      
      {suggestion && (
        <div className="suggestion-container">
          <div className="suggestion-header">
            <span className="suggestion-icon">💡</span>
            <h4>AI Recommendation</h4>
          </div>
          <div className="suggestion-content">
            <p>{suggestion}</p>
          </div>
          <div className="suggestion-footer">
            <span className="disclaimer">
              ⚠️ This is general advice only. Consult a healthcare professional for proper diagnosis.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}






