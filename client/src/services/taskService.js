import api from './api'

const taskService = {
  getTasks: async (params = {}) => {
    const { data } = await api.get('/tasks', { params })
    return data
  },

  createTask: async (taskData) => {
    const { data } = await api.post('/tasks', taskData)
    return data
  },

  getTask: async (id) => {
    const { data } = await api.get(`/tasks/${id}`)
    return data
  },

  updateTask: async (id, taskData) => {
    const { data } = await api.put(`/tasks/${id}`, taskData)
    return data
  },

  updateTaskStatus: async (id, status, blockerReason = null) => {
    const { data } = await api.patch(`/tasks/${id}/status`, { status, blockerReason })
    return data
  },

  assignTask: async (id, assigneeId) => {
    const { data } = await api.patch(`/tasks/${id}/assign`, { assigneeId })
    return data
  },

  blockTask: async (id, reason) => {
    const { data } = await api.patch(`/tasks/${id}/block`, { reason })
    return data
  },

  unblockTask: async (id) => {
    const { data } = await api.patch(`/tasks/${id}/unblock`)
    return data
  },

  deleteTask: async (id) => {
    const { data } = await api.delete(`/tasks/${id}`)
    return data
  },

  getTaskComments: async (id) => {
    const { data } = await api.get(`/tasks/${id}/comments`)
    return data
  },

  addComment: async (id, text) => {
    const { data } = await api.post(`/tasks/${id}/comments`, { text })
    return data
  },

  getMyTasks: async (params = {}) => {
    const { data } = await api.get('/tasks/my-tasks', { params })
    return data
  },
}

export default taskService
