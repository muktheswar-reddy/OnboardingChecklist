import api from './api'

const templateService = {
  getTemplates: async (params = {}) => {
    const { data } = await api.get('/templates', { params })
    return data
  },

  createTemplate: async (templateData) => {
    const { data } = await api.post('/templates', templateData)
    return data
  },

  getTemplate: async (id) => {
    const { data } = await api.get(`/templates/${id}`)
    return data
  },

  updateTemplate: async (id, templateData) => {
    const { data } = await api.put(`/templates/${id}`, templateData)
    return data
  },

  deleteTemplate: async (id) => {
    const { data } = await api.delete(`/templates/${id}`)
    return data
  },

  cloneTemplate: async (id) => {
    const { data } = await api.post(`/templates/${id}/clone`)
    return data
  },
}

export default templateService
