import api from './api'

const authService = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    return data
  },

  register: async (formData) => {
    const { data } = await api.post('/auth/register', formData)
    return data
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me')
    return data
  },

  logout: async () => {
    try { await api.post('/auth/logout') } catch {}
  },

  changePassword: async (currentPassword, newPassword) => {
    const { data } = await api.put('/auth/change-password', { currentPassword, newPassword })
    return data
  },

  updateProfile: async (profileData) => {
    const { data } = await api.put('/auth/profile', profileData)
    return data
  },
}

export default authService
