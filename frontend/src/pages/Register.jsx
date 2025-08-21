import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register(){
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('patient')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await register({ name, email, password, role })
      navigate('/')
    } catch (e) {
      setError(e.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 520, margin: '40px auto' }}>
        <h2>Create account</h2>
        {error && <p style={{ color: '#fca5a5' }}>{error}</p>}
        <form onSubmit={onSubmit}>
          <label className="label">Name</label>
          <input className="input" value={name} onChange={e => setName(e.target.value)} />
          <label className="label">Email</label>
          <input className="input" value={email} onChange={e => setEmail(e.target.value)} />
          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <label className="label">Role</label>
          <select className="input" value={role} onChange={e => setRole(e.target.value)}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
          <div className="space" />
          <button className="btn" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
        </form>
        <div className="space" />
        <p className="label">Have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  )
}






