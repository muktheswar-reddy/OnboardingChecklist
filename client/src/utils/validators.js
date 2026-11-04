export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email) ? null : 'Enter a valid email address'
}

export function validateRequired(value, label = 'This field') {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${label} is required`
  }
  return null
}

export function validateMinLength(value, min, label = 'This field') {
  if (value && value.length < min) {
    return `${label} must be at least ${min} characters`
  }
  return null
}

export function validateMaxLength(value, max, label = 'This field') {
  if (value && value.length > max) {
    return `${label} must be at most ${max} characters`
  }
  return null
}

export function validatePassword(password) {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  return null
}

export function validateConfirmPassword(password, confirm) {
  if (!confirm) return 'Please confirm your password'
  if (password !== confirm) return 'Passwords do not match'
  return null
}

export function validateDate(dateStr, label = 'Date') {
  if (!dateStr) return `${label} is required`
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return `${label} is not a valid date`
  return null
}

export function validateLoginForm({ email, password }) {
  const errors = {}
  const emailError = validateEmail(email)
  if (emailError) errors.email = emailError
  const passwordError = validateRequired(password, 'Password')
  if (passwordError) errors.password = passwordError
  return errors
}

export function validateEmployeeForm(data) {
  const errors = {}
  if (!data.name?.trim()) errors.name = 'Full name is required'
  const emailError = validateEmail(data.email)
  if (emailError) errors.email = emailError
  if (!data.jobTitle?.trim()) errors.jobTitle = 'Job title is required'
  if (!data.department) errors.department = 'Department is required'
  if (!data.joiningDate) errors.joiningDate = 'Joining date is required'
  return errors
}

export function validateTaskForm(data) {
  const errors = {}
  if (!data.title?.trim()) errors.title = 'Task title is required'
  if (!data.priority) errors.priority = 'Priority is required'
  return errors
}

export function hasErrors(errors) {
  return Object.keys(errors).some(k => !!errors[k])
}
