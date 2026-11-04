import React, { useState, useEffect } from 'react'
import employeeService from '../services/employeeService'
import EmployeeCard from '../components/employees/EmployeeCard'
import EmployeeForm from '../components/employees/EmployeeForm'
import EmployeeFilters from '../components/employees/EmployeeFilters'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import Skeleton from '../components/ui/Skeleton'

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search: '', department: '', status: '', page: 1, limit: 12 })
  const [totalPages, setTotalPages] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    fetchEmployees()
  }, [filters])

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const res = await employeeService.getEmployees(filters)
      if (res.data) {
        setEmployees(res.data.employees || res.data || [])
        setTotalPages(res.data.totalPages || 1)
      }
    } catch (err) {
      console.error('Failed to load employees:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenAdd = () => {
    setSelectedEmployee(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (emp) => {
    setSelectedEmployee(emp)
    setIsModalOpen(true)
  }

  const handleFormSubmit = async (formData) => {
    setFormSubmitting(true)
    try {
      if (selectedEmployee) {
        await employeeService.updateEmployee(selectedEmployee._id, formData)
      } else {
        await employeeService.createEmployee(formData)
      }
      setIsModalOpen(false)
      fetchEmployees()
    } catch (err) {
      console.error('Error saving employee:', err)
      alert(err.response?.data?.message || 'Failed to save employee. Check email format or duplicate.')
    } finally {
      setFormSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
            Employee Directory & Onboarding
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Manage staff profiles, assign roles, and track individual onboarding progress
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <button
              onClick={() => setViewMode('grid')}
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 0 }}
            >
              ⊞ Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
              style={{ borderRadius: 0 }}
            >
              ☰ List
            </button>
          </div>

          <Button variant="primary" onClick={handleOpenAdd}>
            + Add New Employee
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: 'var(--space-4)' }}>
        <EmployeeFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Employees Grid/List */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card" style={{ padding: 'var(--space-5)', height: '220px' }}>
              <Skeleton shape="avatar" size="48px" style={{ marginBottom: '12px' }} />
              <Skeleton shape="text" style={{ width: '60%', marginBottom: '8px' }} />
              <Skeleton shape="text" style={{ width: '40%', marginBottom: '16px' }} />
              <Skeleton shape="text" style={{ width: '100%' }} />
            </div>
          ))}
        </div>
      ) : employees.length === 0 ? (
        <div className="card" style={{ padding: 'var(--space-8)' }}>
          <EmptyState
            icon="👥"
            title="No Employees Found"
            description="No employee profiles match the current filter criteria or directory is empty."
            action={<Button variant="primary" onClick={handleOpenAdd}>Add First Employee</Button>}
          />
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
          {employees.map((emp) => (
            <EmployeeCard
              key={emp._id}
              employee={emp}
              onEdit={handleOpenEdit}
            />
          ))}
        </div>
      ) : (
        <div className="table-container card">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Department</th>
                <th>Job Title</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id}>
                  <td>
                    <strong>{emp.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{emp.email}</div>
                  </td>
                  <td><code>{emp.employeeId || 'EMP'}</code></td>
                  <td>{emp.department?.name || emp.department || 'General'}</td>
                  <td>{emp.jobTitle}</td>
                  <td>
                    <span className={`status-badge status-${emp.status || 'active'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleOpenEdit(emp)} className="btn btn-secondary btn-sm">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Add / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedEmployee ? 'Edit Employee Profile' : 'Add Employee & Generate Onboarding Checklist'}
      >
        <EmployeeForm
          initialData={selectedEmployee}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsModalOpen(false)}
          loading={formSubmitting}
        />
      </Modal>
    </div>
  )
}
