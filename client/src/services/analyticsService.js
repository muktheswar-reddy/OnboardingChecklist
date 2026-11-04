import api from './api'

const analyticsService = {
  getOverview: async () => {
    const { data } = await api.get('/analytics/overview')
    return data
  },

  getDepartmentStats: async () => {
    const { data } = await api.get('/analytics/departments')
    return data
  },

  getRoleStats: async () => {
    const { data } = await api.get('/analytics/roles')
    return data
  },

  getBlockerStats: async () => {
    const { data } = await api.get('/analytics/blockers')
    return data
  },

  getOnboardingDuration: async () => {
    const { data } = await api.get('/analytics/onboarding-duration')
    return data
  },

  getTrends: async (period = '30d') => {
    const { data } = await api.get('/analytics/trends', { params: { period } })
    return data
  },
}

export default analyticsService
