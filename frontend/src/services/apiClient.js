const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:5700'
const USE_MOCK = String(import.meta?.env?.VITE_USE_MOCK || 'true') === 'true'

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL
    this.token = null
  }

  setToken(token) { this.token = token }

  async request(path, options = {}) {
    if (USE_MOCK) return this.mock(path, options)
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) }
    if (this.token) headers['Authorization'] = `Bearer ${this.token}`
    const res = await fetch(this.baseUrl + path, { ...options, headers })
    if (!res.ok) throw new Error(`API ${res.status}`)
    return res.status === 204 ? null : res.json()
  }

  get(path) { return this.request(path, { method: 'GET' }) }
  post(path, body) { return this.request(path, { method: 'POST', body: JSON.stringify(body) }) }
  put(path, body) { return this.request(path, { method: 'PUT', body: JSON.stringify(body) }) }
  del(path) { return this.request(path, { method: 'DELETE' }) }

  async mock(path, options) {
    await new Promise(r => setTimeout(r, 200))
    const { method = 'GET' } = options
    const db = MockDatabase.get()
    if (path === '/auth/login' && method === 'POST') return db.login(JSON.parse(options.body))
    if (path === '/auth/register' && method === 'POST') return db.register(JSON.parse(options.body))
    if (path === '/patients' && method === 'GET') return db.listPatients()
    if (path.startsWith('/appointments')) {
      if (method === 'GET') return db.listAppointments()
      if (method === 'POST') return db.createAppointment(JSON.parse(options.body))
    }
    if (path === '/reminders') {
      if (method === 'GET') return db.listReminders()
      if (method === 'POST') return db.createReminder(JSON.parse(options.body))
    }
    if (path === '/symptoms' && method === 'POST') return db.submitSymptoms(JSON.parse(options.body))
    if (path === '/symptoms/analyze' && method === 'POST') return db.analyzeSymptoms(JSON.parse(options.body))
    throw new Error(`Mock not implemented for ${method} ${path}`)
  }
}

class MockDatabase {
  static instance = null
  static get() {
    if (!MockDatabase.instance) MockDatabase.instance = new MockDatabase()
    return MockDatabase.instance
  }
  constructor() {
    this.users = [
      { id: 'u1', name: 'Dr. Ada', email: 'ada@care.link', password: 'test', role: 'doctor' },
      { id: 'u2', name: 'Alex Patient', email: 'alex@care.link', password: 'test', role: 'patient' },
    ]
    this.currentUserId = null
    this.appointments = [
      { id: 'a1', patientId: 'u2', doctorId: 'u1', datetime: new Date().toISOString(), status: 'pending', reason: 'Fever and cough' }
    ]
    this.reminders = [
      { id: 'r1', userId: 'u2', text: 'Take medicine', time: '21:00' }
    ]
    this.symptomReports = []
  }

  login({ email, password }) {
    const user = this.users.find(u => u.email === email && u.password === password)
    if (!user) throw new Error('Invalid credentials')
    this.currentUserId = user.id
    return { token: 'mock-token-' + user.id, user: { id: user.id, name: user.name, email: user.email, role: user.role } }
  }

  register({ name, email, password, role = 'patient' }) {
    if (this.users.some(u => u.email === email)) throw new Error('Email already used')
    const id = 'u' + (this.users.length + 1)
    const user = { id, name, email, password, role }
    this.users.push(user)
    this.currentUserId = id
    return { token: 'mock-token-' + id, user: { id, name, email, role } }
  }

  listPatients() { return this.users.filter(u => u.role === 'patient').map(u => ({ id: u.id, name: u.name, email: u.email })) }
  listAppointments() { return this.appointments }
  createAppointment({ patientId, datetime, reason }) {
    const id = 'a' + (this.appointments.length + 1)
    const doctorId = this.users.find(u => u.role === 'doctor')?.id || 'u1'
    const appt = { id, patientId, doctorId, datetime, reason, status: 'pending' }
    this.appointments.push(appt)
    return appt
  }
  listReminders() { return this.reminders }
  createReminder({ text, time }) {
    const id = 'r' + (this.reminders.length + 1)
    const userId = this.currentUserId || 'u2'
    const reminder = { id, userId, text, time }
    this.reminders.push(reminder)
    return reminder
  }
  submitSymptoms({ symptoms, duration, severity }) {
    const id = 's' + (this.symptomReports.length + 1)
    const report = { id, userId: this.currentUserId || 'u2', symptoms, duration, severity, createdAt: new Date().toISOString() }
    this.symptomReports.push(report)
    return report
  }
  analyzeSymptoms({ symptoms }) {
    const text = (symptoms || '').toLowerCase()
    if (text.includes('fever') && text.includes('cough')) return { suggestion: 'Flu-like symptoms, please consult a doctor.' }
    if (text.includes('headache')) return { suggestion: 'Hydrate and rest. If persistent, book an appointment.' }
    return { suggestion: 'Monitor symptoms. If they worsen, consult a doctor.' }
  }
}

export const apiClient = new ApiClient()






