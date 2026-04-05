import { createContext, useContext, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('examai_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const res = await api.login(email, password)
      setUser(res.user)
      localStorage.setItem('examai_user', JSON.stringify(res.user))
      toast.success(`Welcome back, ${res.user.name}! 🎉`)
      return { success: true }
    } catch (err) {
      toast.error(err.message || 'Login failed')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (data) => {
    setLoading(true)
    try {
      const res = await api.register(data)
      setUser(res.user)
      localStorage.setItem('examai_user', JSON.stringify(res.user))
      toast.success('Account created successfully! 🚀')
      return { success: true }
    } catch (err) {
      toast.error(err.message || 'Registration failed')
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('examai_user')
    toast.success('Logged out successfully')
  }, [])

  const updateUser = useCallback((data) => {
    const updated = { ...user, ...data }
    setUser(updated)
    localStorage.setItem('examai_user', JSON.stringify(updated))
  }, [user])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
