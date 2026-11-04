import api from './api'

const employeeService = {
  getEmployees: async (params = {}) => {
    const { data } = await api.get('/employees', { params })
    return data
  },

  createEmployee: async (employeeData) => {
    const { data } = await api.post('/employees', employeeData)
    return data
  },

  getEmployee: async (id) => {
    const { data } = await api.get(`/employees/${id}`)
    return data
  },

  updateEmployee: async (id, employeeData) => {
    const { data } = await api.put(`/employees/${id}`, employeeData)
    return data
  },

  deleteEmployee: async (id) => {
    const { data } = await api.delete(`/employees/${id}`)
    return data
  },

  getEmployeeActivity: async (id) => {
    const { data } = await api.get(`/employees/${id}/activity`)
    return data
  },
}

export default employeeService
