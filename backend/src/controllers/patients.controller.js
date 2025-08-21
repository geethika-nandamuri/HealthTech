import User from '../models/User.js'

export async function listPatients(_req, res){
  const patients = await User.find({ role: 'patient' }).select('_id name email')
  return res.json(patients.map(p => ({ id: p._id, name: p.name, email: p.email })))
}



