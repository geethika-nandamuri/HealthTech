import { useState } from 'react'
import { apiClient } from '../services/apiClient.js'

export default function Chatbot(){
  const [messages, setMessages] = useState([{ 
    role: 'bot', 
    text: 'Hi there! 👋 I\'m MediGuide, your friendly AI health assistant. Tell me how you\'re feeling and I\'ll do my best to help! 💙' 
  }])
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
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: '⚠️ Oops! I\'m having trouble connecting right now. Please try again in a moment! 💙' 
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="card">
      <div className="chat-header">
        <div className="chat-title">
          <div className="chat-icon">🤖</div>
          <h3>AI Health Assistant</h3>
        </div>
        <div className="chat-status">
          <span className="status-dot"></span>
          Online
        </div>
      </div>
      
      <div className="chatbot-container">
        {messages.map((m, idx) => (
          <div key={idx} className={`chat-message ${m.role}`}>
            <div className="message-avatar">
              {m.role === 'bot' ? '🤖' : '👤'}
            </div>
            <div className="message-content">
              <div className="message-text">{m.text}</div>
              <div className="message-time">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-message bot">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="chat-input-container">
        <input 
          className="chat-input" 
          placeholder="Describe your symptoms..." 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <button 
          className="btn send-btn" 
          onClick={send} 
          disabled={loading || !input.trim()}
        >
          {loading ? (
            <span className="loading-spinner">⏳</span>
          ) : (
            <span>Send</span>
          )}
        </button>
      </div>
    </div>
  )
}
