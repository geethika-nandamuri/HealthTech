import { useEffect, useState } from 'react'
import { apiClient } from '../../services/apiClient.js'

export default function DoctorPatients(){
  const [patients, setPatients] = useState([])
  useEffect(() => { apiClient.get('/patients').then(setPatients) }, [])
  return (
    <div className="card">
      <h3>Patients</h3>
      <table className="table">
        <thead><tr><th>Name</th><th>Email</th></tr></thead>
        <tbody>
          {patients.map(p => <tr key={p.id}><td>{p.name}</td><td>{p.email}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}






