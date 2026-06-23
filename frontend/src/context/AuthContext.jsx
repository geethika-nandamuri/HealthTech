import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import apiClient from '../services/apiClient.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('auth')
    if (stored) {
      const parsed = JSON.parse(stored)
      setUser(parsed.user)
      setToken(parsed.token)
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const { data } = await apiClient.post('/api/auth/login', { email, password })
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('auth', JSON.stringify(data))
    return data
  }

  const register = async (payload) => {
    const { data } = await apiClient.post('/api/auth/register', payload)
    setUser(data.user)
    setToken(data.token)
    localStorage.setItem('auth', JSON.stringify(data))
    return data
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth')
  }

  const value = useMemo(() => ({ user, token, loading, login, register, logout }), [user, token, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
