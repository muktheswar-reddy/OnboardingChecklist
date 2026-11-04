import api from './api'

const onboardingService = {
  getOnboardings: async (params = {}) => {
    const { data } = await api.get('/onboardings', { params })
    return data
  },

  createOnboarding: async (onboardingData) => {
    const { data } = await api.post('/onboardings', onboardingData)
    return data
  },

  getOnboarding: async (id) => {
    const { data } = await api.get(`/onboardings/${id}`)
    return data
  },

  updateOnboarding: async (id, onboardingData) => {
    const { data } = await api.put(`/onboardings/${id}`, onboardingData)
    return data
  },

  applyTemplate: async (id, templateId) => {
    const { data } = await api.post(`/onboardings/${id}/apply-template`, { templateId })
    return data
  },
}

export default onboardingService
