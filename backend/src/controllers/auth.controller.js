import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

function signToken(user){
  return jwt.sign({ id: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
}

export async function register(req, res){
  try{
    const { name, email, password, role='patient' } = req.body
    if(!name || !email || !password) return res.status(400).json({ message: 'Missing fields' })
    const exists = await User.findOne({ email })
    if(exists) return res.status(409).json({ message: 'Email already in use' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash, role })
    const token = signToken(user)
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  }catch(e){
    return res.status(500).json({ message: 'Registration failed' })
  }
}

export async function login(req, res){
  try{
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if(!user) return res.status(401).json({ message: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if(!ok) return res.status(401).json({ message: 'Invalid credentials' })
    const token = signToken(user)
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  }catch(e){
    return res.status(500).json({ message: 'Login failed' })
  }
}



