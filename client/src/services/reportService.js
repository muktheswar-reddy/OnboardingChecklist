import api from './api'

const reportService = {
  exportCSV: async (type, params = {}) => {
    const response = await api.get(`/reports/${type}/export`, {
      params,
      responseType: 'blob',
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${type}-report-${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(url)
  },

  exportEmployees: async (params = {}) => reportService.exportCSV('employees', params),
  exportTasks: async (params = {}) => reportService.exportCSV('tasks', params),
  exportOnboardings: async (params = {}) => reportService.exportCSV('onboardings', params),
}

export default reportService
