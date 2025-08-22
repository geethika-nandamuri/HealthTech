import { useEffect, useState } from 'react'
import { apiClient } from '../../services/apiClient.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function HealthRecords(){
  const { user } = useAuth()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newRecord, setNewRecord] = useState({ 
    title: '', 
    description: '', 
    category: 'manual',
    recordType: 'other'
  })
  const [activeTab, setActiveTab] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)

  const recordCategories = {
    automatic: 'System Generated',
    manual: 'Manually Added'
  }

  const recordTypes = {
    appointment: 'Appointment',
    prescription: 'Prescription',
    labReport: 'Lab Report',
    vaccination: 'Vaccination',
    surgery: 'Surgery',
    allergy: 'Allergy',
    chronic: 'Chronic Condition',
    other: 'Other'
  }

  const loadRecords = async () => {
    try {
      setLoading(true)
      const data = await apiClient.get('/health-records')
      setRecords(data)
    } catch (e) {
      setError('Failed to load health records')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecords()
  }, [])

  const addRecord = async (e) => {
    e.preventDefault()
    if (!newRecord.title.trim()) return
    
    try {
      await apiClient.post('/health-records', {
        ...newRecord,
        category: 'manual',
        date: new Date().toISOString()
      })
      setNewRecord({ title: '', description: '', category: 'manual', recordType: 'other' })
      setShowAddForm(false)
      loadRecords()
    } catch (e) {
      setError('Failed to add health record')
    }
  }

  const filteredRecords = records.filter(record => {
    if (activeTab === 'all') return true
    if (activeTab === 'automatic') return record.category === 'automatic'
    if (activeTab === 'manual') return record.category === 'manual'
    return record.recordType === activeTab
  })

  const getRecordIcon = (recordType) => {
    const icons = {
      appointment: '📅',
      prescription: '💊',
      labReport: '🔬',
      vaccination: '💉',
      surgery: '🏥',
      allergy: '⚠️',
      chronic: '📋',
      other: '📄'
    }
    return icons[recordType] || '📄'
  }

  const getCategoryColor = (category) => {
    return category === 'automatic' ? 'var(--primary)' : 'var(--success)'
  }

  if (loading) {
    return (
      <div className="card">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your health records...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="health-records-container">
      {/* Header Section */}
      <div className="records-header">
        <div className="header-content">
          <h1>Health Records</h1>
          <p>View and manage your complete medical history</p>
        </div>
        <button 
          className="btn add-record-btn"
          onClick={() => setShowAddForm(true)}
        >
          <span>➕</span>
          Add Record
        </button>
      </div>

      {/* Stats Overview */}
      <div className="records-stats">
        <div className="stat-item">
          <div className="stat-number">{records.length}</div>
          <div className="stat-label">Total Records</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{records.filter(r => r.category === 'automatic').length}</div>
          <div className="stat-label">System Generated</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{records.filter(r => r.category === 'manual').length}</div>
          <div className="stat-label">Manually Added</div>
        </div>
      </div>

      {/* Add Record Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Health Record</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAddForm(false)}
              >
                ✕
              </button>
            </div>
            
            {error && <p className="error-message">{error}</p>}
            
            <form onSubmit={addRecord} className="add-record-form">
              <div className="form-group">
                <label className="label">Record Type</label>
                <select 
                  className="input select"
                  value={newRecord.recordType}
                  onChange={e => setNewRecord({...newRecord, recordType: e.target.value})}
                  required
                >
                  {Object.entries(recordTypes).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="label">Title</label>
                <input 
                  className="input" 
                  value={newRecord.title} 
                  onChange={e => setNewRecord({...newRecord, title: e.target.value})}
                  placeholder="e.g., Blood Test Results, Vaccination Record"
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">Description</label>
                <textarea 
                  className="input textarea" 
                  value={newRecord.description} 
                  onChange={e => setNewRecord({...newRecord, description: e.target.value})}
                  placeholder="Enter details about this health record..."
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn secondary" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn">
                  Add Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Records
        </button>
        <button 
          className={`tab-btn ${activeTab === 'automatic' ? 'active' : ''}`}
          onClick={() => setActiveTab('automatic')}
        >
          System Generated
        </button>
        <button 
          className={`tab-btn ${activeTab === 'manual' ? 'active' : ''}`}
          onClick={() => setActiveTab('manual')}
        >
          Manually Added
        </button>
        <div className="tab-dropdown">
          <select 
            className="type-filter"
            value={activeTab}
            onChange={e => setActiveTab(e.target.value)}
          >
            <option value="all">All Types</option>
            {Object.entries(recordTypes).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Records List */}
      <div className="records-content">
        {filteredRecords.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No health records found</h3>
            <p>
              {activeTab === 'all' 
                ? "Start by adding your first health record or book an appointment to generate automatic records."
                : `No ${activeTab} records found. Try adding some or check other categories.`
              }
            </p>
            {activeTab === 'all' && (
              <button className="btn" onClick={() => setShowAddForm(true)}>
                Add Your First Record
              </button>
            )}
          </div>
        ) : (
          <div className="records-grid">
            {filteredRecords.map(record => (
              <div key={record.id} className="record-card">
                <div className="record-header">
                  <div className="record-type">
                    <span className="record-icon">{getRecordIcon(record.recordType)}</span>
                    <span className="record-type-label">{recordTypes[record.recordType]}</span>
                  </div>
                  <div className="record-meta">
                    <span 
                      className="category-badge"
                      style={{ backgroundColor: getCategoryColor(record.category) }}
                    >
                      {recordCategories[record.category]}
                    </span>
                    <span className="record-date">
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="record-content">
                  <h4 className="record-title">{record.title}</h4>
                  {record.description && (
                    <p className="record-description">{record.description}</p>
                  )}
                </div>

                <div className="record-actions">
                  <button className="action-btn">
                    <span>👁️</span>
                    View Details
                  </button>
                  {record.category === 'manual' && (
                    <button className="action-btn">
                      <span>✏️</span>
                      Edit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
