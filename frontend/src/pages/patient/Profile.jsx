import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { apiClient } from '../../services/apiClient.js'

export default function Profile() {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      // In real app, this would fetch from /api/profile
      // For now, using mock data
      const mockProfile = {
        id: user?.id,
        name: user?.name || 'Alex Patient',
        email: user?.email || 'alex@care.link',
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1990-05-15',
        address: '123 Health Street, Medical City, MC 12345',
        emergencyContact: {
          name: 'Sarah Patient',
          phone: '+1 (555) 987-6543',
          relationship: 'Spouse'
        },
        joinDate: '2024-01-15',
        lastLogin: new Date().toISOString(),
        preferences: {
          notifications: true,
          emailUpdates: true,
          smsReminders: false
        }
      }
      setProfile(mockProfile)
      setFormData(mockProfile)
    } catch (e) {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError('')
      setSuccess('')
      
      // In real app, this would update via API
      // await apiClient.put('/profile', formData)
      
      setProfile({ ...profile, ...formData })
      setEditing(false)
      setSuccess('Profile updated successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setError('Failed to update profile')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <div className="header-content">
          <h1>My Profile</h1>
          <p>Manage your account information and preferences</p>
        </div>
        <div className="profile-actions">
          {!editing && (
            <button 
              className="btn"
              onClick={() => setEditing(true)}
            >
              <span>✏️</span>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="success-message">
          <span>✅</span>
          {success}
        </div>
      )}
      {error && (
        <div className="error-message">
          <span>❌</span>
          {error}
        </div>
      )}

      {/* Profile Content */}
      <div className="profile-content">
        {editing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input"
                    required
                    disabled
                  />
                  <small className="input-help">Email cannot be changed</small>
                </div>
                <div className="form-group">
                  <label className="label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Address</h3>
              <div className="form-group">
                <label className="label">Full Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input textarea"
                  rows="3"
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Emergency Contact</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label className="label">Contact Name</label>
                  <input
                    type="text"
                    name="emergencyContact.name"
                    value={formData.emergencyContact.name}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Contact Phone</label>
                  <input
                    type="tel"
                    name="emergencyContact.phone"
                    value={formData.emergencyContact.phone}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Relationship</label>
                  <input
                    type="text"
                    name="emergencyContact.relationship"
                    value={formData.emergencyContact.relationship}
                    onChange={handleInputChange}
                    className="input"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn secondary" onClick={() => setEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="btn">
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-display">
            {/* Account Info Card */}
            <div className="profile-card">
              <div className="card-header">
                <div className="user-avatar-large">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <h2>{profile.name}</h2>
                  <p className="user-email">{profile.email}</p>
                  <span className="user-role">Patient</span>
                </div>
              </div>
              
              <div className="account-stats">
                <div className="stat-item">
                  <div className="stat-label">Member Since</div>
                  <div className="stat-value">{new Date(profile.joinDate).toLocaleDateString()}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Last Login</div>
                  <div className="stat-value">{new Date(profile.lastLogin).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="profile-card">
              <h3>Personal Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{profile.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email Address</span>
                  <span className="info-value">{profile.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone Number</span>
                  <span className="info-value">{profile.phone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Date of Birth</span>
                  <span className="info-value">{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div className="info-item full-width">
                  <span className="info-label">Address</span>
                  <span className="info-value">{profile.address}</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="profile-card">
              <h3>Emergency Contact</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Contact Name</span>
                  <span className="info-value">{profile.emergencyContact.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Contact Phone</span>
                  <span className="info-value">{profile.emergencyContact.phone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Relationship</span>
                  <span className="info-value">{profile.emergencyContact.relationship}</span>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="profile-card">
              <h3>Notification Preferences</h3>
              <div className="preferences-list">
                <div className="preference-item">
                  <span className="preference-label">Email Notifications</span>
                  <span className={`preference-status ${profile.preferences.emailUpdates ? 'enabled' : 'disabled'}`}>
                    {profile.preferences.emailUpdates ? '✅ Enabled' : '❌ Disabled'}
                  </span>
                </div>
                <div className="preference-item">
                  <span className="preference-label">SMS Reminders</span>
                  <span className={`preference-status ${profile.preferences.smsReminders ? 'enabled' : 'disabled'}`}>
                    {profile.preferences.smsReminders ? '✅ Enabled' : '❌ Disabled'}
                  </span>
                </div>
                <div className="preference-item">
                  <span className="preference-label">App Notifications</span>
                  <span className={`preference-status ${profile.preferences.notifications ? 'enabled' : 'disabled'}`}>
                    {profile.preferences.notifications ? '✅ Enabled' : '❌ Disabled'}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="profile-card">
              <h3>Account Actions</h3>
              <div className="action-buttons">
                <button className="btn secondary">
                  <span>🔒</span>
                  Change Password
                </button>
                <button className="btn secondary">
                  <span>📧</span>
                  Update Email
                </button>
                <button className="btn secondary">
                  <span>📱</span>
                  Two-Factor Auth
                </button>
                <button className="btn danger" onClick={logout}>
                  <span>🚪</span>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
