import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  const isAuthenticated = !!user

  const isAdmin = () => user?.role === 'admin'
  const isHR = () => user?.role === 'hr' || user?.role === 'admin'
  const isManager = () => ['manager', 'hr', 'admin'].includes(user?.role)
  const isIT = () => user?.role === 'it' || user?.role === 'admin'

  const fetchMe = useCallback(async () => {
    try {
      const res = await authService.getMe()
      const userData = res?.data?.user || res?.data || res?.user || res
      setUser(userData)
    } catch {
      setUser(null)
      setToken(null)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchMe()
    } else {
      setLoading(false)
    }
  }, [token, fetchMe])

  const login = async (email, password) => {
    const res = await authService.login(email, password)
    const payload = res?.data || res
    const newToken = payload?.token || res?.token
    const newUser = payload?.user || res?.user || payload
    if (newToken) {
      localStorage.setItem('token', newToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      setToken(newToken)
      setUser(newUser)
    }
    return newUser
  }

  const register = async (formData) => {
    const res = await authService.register(formData)
    const payload = res?.data || res
    const newToken = payload?.token || res?.token
    const newUser = payload?.user || res?.user || payload
    if (newToken) {
      localStorage.setItem('token', newToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      setToken(newToken)
      setUser(newUser)
    }
    return newUser
  }

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        isAdmin,
        isHR,
        isManager,
        isIT,
        refreshUser: fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
