import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export function requireAuth(req, res, next) {
  const header = req.headers['authorization'] || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ message: 'Unauthorized' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export function requireRole(roles = []) {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user?.id)
      if (!user || (roles.length && !roles.includes(user.role))) {
        return res.status(403).json({ message: 'Forbidden' })
      }
      req.currentUser = user
      next()
    } catch (e) {
      return res.status(500).json({ message: 'Auth error' })
    }
  }
}



