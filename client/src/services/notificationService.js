import api from './api'

const notificationService = {
  getNotifications: async (params = {}) => {
    const { data } = await api.get('/notifications', { params })
    return data
  },

  markRead: async (id) => {
    const { data } = await api.patch(`/notifications/${id}/read`)
    return data
  },

  markAllRead: async () => {
    const { data } = await api.patch('/notifications/read-all')
    return data
  },

  getUnreadCount: async () => {
    const { data } = await api.get('/notifications/unread-count')
    return data
  },

  deleteNotification: async (id) => {
    const { data } = await api.delete(`/notifications/${id}`)
    return data
  },
}

export default notificationService
