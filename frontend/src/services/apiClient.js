// apiClient.js

// Backend base URL (Render in prod, localhost in dev)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5700/api";

// Toggle mock mode (defaults to false in production)
const USE_MOCK = String(import.meta.env.VITE_USE_MOCK || "false") === "true";

// Force disable mock mode to use real MongoDB
const FORCE_REAL_API = true;

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async request(path, options = {}) {
    // Use real API instead of mock
    if (USE_MOCK && !FORCE_REAL_API) return this.mock(path, options);

    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };
    if (this.token) headers["Authorization"] = `Bearer ${this.token}`;

    const res = await fetch(this.baseUrl + path, { ...options, headers });
    if (!res.ok) throw new Error(`API ${res.status}`);
    return res.status === 204 ? null : res.json();
  }

  get(path) {
    return this.request(path, { method: "GET" });
  }
  post(path, body) {
    return this.request(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
  put(path, body) {
    return this.request(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }
  del(path) {
    return this.request(path, { method: "DELETE" });
  }

  // --- Mock implementation ---
  async mock(path, options) {
    await new Promise((r) => setTimeout(r, 200));
    const { method = "GET" } = options;
    const db = MockDatabase.get();

    if (path === "/auth/login" && method === "POST")
      return db.login(JSON.parse(options.body));
    if (path === "/auth/register" && method === "POST")
      return db.register(JSON.parse(options.body));
    if (path === "/patients" && method === "GET") return db.listPatients();
    if (path.startsWith("/appointments")) {
      if (method === "GET") return db.listAppointments();
      if (method === "POST")
        return db.createAppointment(JSON.parse(options.body));
    }
    if (path === "/reminders") {
      if (method === "GET") return db.listReminders();
      if (method === "POST")
        return db.createReminder(JSON.parse(options.body));
    }
    if (path === "/symptoms" && method === "POST")
      return db.submitSymptoms(JSON.parse(options.body));
    if (path === "/symptoms/analyze" && method === "POST")
      return db.analyzeSymptoms(JSON.parse(options.body));
    if (path === "/health-records") {
      if (method === "GET") return db.listHealthRecords();
      if (method === "POST")
        return db.createHealthRecord(JSON.parse(options.body));
    }
    if (path === "/profile") {
      if (method === "GET") return db.getProfile();
      if (method === "PUT")
        return db.updateProfile(JSON.parse(options.body));
    }

    throw new Error(`Mock not implemented for ${method} ${path}`);
  }
}

class MockDatabase {
  static instance = null;
  static get() {
    if (!MockDatabase.instance) MockDatabase.instance = new MockDatabase();
    return MockDatabase.instance;
  }
  constructor() {
    this.users = [
      {
        id: "u1",
        name: "Dr. Ada",
        email: "ada@care.link",
        password: "test",
        role: "doctor",
      },
      {
        id: "u2",
        name: "Alex Patient",
        email: "alex@care.link",
        password: "test",
        role: "patient",
      },
    ];
    this.currentUserId = null;
    this.appointments = [
      {
        id: "a1",
        patientId: "u2",
        doctorId: "u1",
        datetime: new Date().toISOString(),
        status: "pending",
        reason: "Fever and cough",
      },
    ];
    this.reminders = [{ id: "r1", userId: "u2", text: "Take medicine", time: "21:00" }];
    this.symptomReports = [];
    this.healthRecords = [
      // Automatic records (system generated)
      { 
        id: "appt_1", 
        title: "Appointment - Fever and cough", 
        description: "Appointment scheduled for 12/15/2024 at 2:30 PM. Status: completed", 
        category: "automatic",
        recordType: "appointment",
        date: new Date().toISOString() 
      },
      { 
        id: "appt_2", 
        title: "Appointment - Annual Checkup", 
        description: "Appointment scheduled for 11/20/2024 at 10:00 AM. Status: pending", 
        category: "automatic",
        recordType: "appointment",
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() 
      },
      // Manual records (user added)
      { 
        id: "hr1", 
        title: "Blood Test Results", 
        description: "Routine blood work - all values within normal range. Cholesterol: 180, Blood Sugar: 95", 
        category: "manual",
        recordType: "labReport",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() 
      },
      { 
        id: "hr2", 
        title: "COVID-19 Vaccination", 
        description: "Received Pfizer COVID-19 vaccine booster shot. No side effects reported.", 
        category: "manual",
        recordType: "vaccination",
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() 
      },
      { 
        id: "hr3", 
        title: "Peanut Allergy", 
        description: "Severe allergic reaction to peanuts. Carry EpiPen at all times.", 
        category: "manual",
        recordType: "allergy",
        date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString() 
      }
    ];
  }

  login({ email, password }) {
    const user = this.users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) throw new Error("Invalid credentials");
    this.currentUserId = user.id;
    return {
      token: "mock-token-" + user.id,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  register({ name, email, password, role = "patient" }) {
    if (this.users.some((u) => u.email === email))
      throw new Error("Email already used");
    const id = "u" + (this.users.length + 1);
    const user = { id, name, email, password, role };
    this.users.push(user);
    this.currentUserId = id;
    return {
      token: "mock-token-" + id,
      user: { id, name, email, role },
    };
  }

  listPatients() {
    return this.users
      .filter((u) => u.role === "patient")
      .map((u) => ({ id: u.id, name: u.name, email: u.email }));
  }
  listAppointments() {
    return this.appointments;
  }
  createAppointment({ patientId, datetime, reason }) {
    const id = "a" + (this.appointments.length + 1);
    const doctorId = this.users.find((u) => u.role === "doctor")?.id || "u1";
    const appt = { id, patientId, doctorId, datetime, reason, status: "pending" };
    this.appointments.push(appt);
    return appt;
  }
  listReminders() {
    return this.reminders;
  }
  createReminder({ text, time }) {
    const id = "r" + (this.reminders.length + 1);
    const userId = this.currentUserId || "u2";
    const reminder = { id, userId, text, time };
    this.reminders.push(reminder);
    return reminder;
  }
  submitSymptoms({ symptoms, duration, severity }) {
    const id = "s" + (this.symptomReports.length + 1);
    const report = {
      id,
      userId: this.currentUserId || "u2",
      symptoms,
      duration,
      severity,
      createdAt: new Date().toISOString(),
    };
    this.symptomReports.push(report);
    return report;
  }
            analyzeSymptoms({ symptoms }) {
            const text = (symptoms || "").toLowerCase();

            if (text.includes("cold") || text.includes("runny nose") || text.includes("congestion")) {
              return {
                suggestion: "🤧 Try honey tea, rest, and steam inhalation for cold symptoms! 💙",
              };
            }
            if (text.includes("fever") && text.includes("cough")) {
              return {
                suggestion: "🤒 Rest, drink fluids, and take acetaminophen for fever. See doctor if above 103°F! 💙",
              };
            }
            if (text.includes("headache")) {
              return {
                suggestion: "😵‍💫 Try dark room rest, hydration, and over-the-counter pain relievers for headaches! 💙",
              };
            }
            if (text.includes("sore throat")) {
              return {
                suggestion: "😷 Try salt water gargle, honey, and warm tea for sore throat relief! 💙",
              };
            }
            if (text.includes("nausea") || text.includes("vomiting")) {
              return {
                suggestion: "🤢 Try ginger tea, small sips of water, and bland foods like crackers! 💙",
              };
            }
            if (text.includes("fatigue") || text.includes("tired")) {
              return {
                suggestion: "😴 Get 8 hours sleep, reduce caffeine, and try light exercise for fatigue! 💙",
              };
            }
            if (text.includes("back pain")) {
              return {
                suggestion: "🦴 Try gentle stretching, heat/cold therapy, and proper posture for back pain! 💙",
              };
            }
            if (text.includes("stomach") || text.includes("abdominal")) {
              return {
                suggestion: "🤢 Try peppermint tea, small meals, and avoid spicy foods for stomach issues! 💙",
              };
            }

            return {
              suggestion: "🤔 Try rest, hydration, and over-the-counter remedies. See doctor if symptoms persist! 💙",
            };
          }
  
  listHealthRecords() {
    return this.healthRecords;
  }
  
  createHealthRecord({ title, description, recordType = 'other' }) {
    const id = "hr" + (this.healthRecords.length + 1);
    const record = { 
      id, 
      title, 
      description, 
      recordType,
      category: 'manual',
      date: new Date().toISOString() 
    };
    this.healthRecords.push(record);
    return record;
  }

  getProfile() {
    return {
      id: "u2",
      name: "Alex Patient",
      email: "alex@care.link",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "1990-05-15",
      address: "123 Health Street, Medical City, MC 12345",
      emergencyContact: {
        name: "Sarah Patient",
        phone: "+1 (555) 987-6543",
        relationship: "Spouse"
      },
      joinDate: "2024-01-15",
      lastLogin: new Date().toISOString(),
      preferences: {
        notifications: true,
        emailUpdates: true,
        smsReminders: false
      }
    };
  }

  updateProfile(profileData) {
    // In a real app, this would update the database
    return { ...this.getProfile(), ...profileData };
  }
}

export const apiClient = new ApiClient();
