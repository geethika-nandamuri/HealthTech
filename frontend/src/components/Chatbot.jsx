import { useState } from 'react'
import { apiClient } from '../services/apiClient.js'

export default function Chatbot(){
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Describe your symptoms.' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const send = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await apiClient.post('/symptoms/analyze', { symptoms: userMsg.text })
      setMessages(prev => [...prev, { role: 'bot', text: res.suggestion }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, something went wrong.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div style={{ maxHeight: 260, overflowY: 'auto', display: 'grid', gap: 8 }}>
        {messages.map((m, idx) => (
          <div key={idx} className="row">
            <span className="pill">{m.role === 'bot' ? 'Bot' : 'You'}</span>
            <span>{m.text}</span>
          </div>
        ))}
      </div>
      <div className="space" />
      <div className="row">
        <input className="input" placeholder="Type symptoms..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e=> e.key==='Enter' && send()} />
        <button className="btn" onClick={send} disabled={loading}>{loading? 'Thinking...' : 'Send'}</button>
      </div>
    </div>
  )
}






