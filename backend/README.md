# MediGuide Backend

Express + MongoDB backend providing APIs for auth, patients, appointments, reminders, and symptoms.

## Setup
1. Create env as `backend/.env`:
```
PORT=5700
MONGO_URI=mongodb://127.0.0.1:27017/mediguide
JWT_SECRET=supersecretchangeme
JWT_EXPIRES_IN=7d
```

2. Install deps:
```
cd backend
npm install
```

3. Run dev:
```
npm run dev
```

## Endpoints
- POST `/auth/register` { name, email, password, role }
- POST `/auth/login` { email, password }
- GET `/patients` (doctor-only)
- GET `/appointments`
- POST `/appointments` { patientId, datetime, reason }
- GET `/reminders`
- POST `/reminders` { text, time }
- POST `/symptoms` { symptoms, duration, severity }
- POST `/symptoms/analyze` { symptoms } → { suggestion }

Auth: pass `Authorization: Bearer <token>` for protected endpoints.

