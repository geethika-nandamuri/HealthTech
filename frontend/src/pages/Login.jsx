import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login(){
  const { login } = useAuth()
  const [email, setEmail] = useState('alex@care.link')
  const [password, setPassword] = useState('test')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (e) {
      setError(e.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
        <h2>Login</h2>
        {error && <p style={{ color: '#fca5a5' }}>{error}</p>}
        <form onSubmit={onSubmit}>
          <label className="label">Email</label>
          <input className="input" value={email} onChange={e => setEmail(e.target.value)} />
          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <div className="space" />
          <button className="btn" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <div className="space" />
        <p className="label">No account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  )
}






