// Task Statuses
export const TASK_STATUSES = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  BLOCKED: 'blocked',
  OVERDUE: 'overdue',
}

export const TASK_STATUS_LABELS = {
  not_started: 'Not Started',
  in_progress: 'In Progress',
  completed: 'Completed',
  blocked: 'Blocked',
  overdue: 'Overdue',
}

// Task Priorities
export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
}

export const TASK_PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
}

// Roles
export const ROLES = {
  ADMIN: 'admin',
  HR: 'hr',
  MANAGER: 'manager',
  IT: 'it',
  EMPLOYEE: 'employee',
}

export const ROLE_LABELS = {
  admin: 'Administrator',
  hr: 'HR',
  manager: 'Manager',
  it: 'IT',
  employee: 'Employee',
}

// Departments
export const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Finance',
  'HR',
  'Operations',
  'Legal',
  'Customer Success',
]

// Onboarding Statuses
export const ONBOARDING_STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  DELAYED: 'delayed',
  CANCELLED: 'cancelled',
}

export const ONBOARDING_STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  delayed: 'Delayed',
  cancelled: 'Cancelled',
}

// Roles List for UI
export const ROLES_LIST = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'HR Executive',
  'UI/UX Designer',
  'Data Analyst',
  'Marketing Executive',
  'Product Manager',
  'Custom Role'
]

export const DEPARTMENTS_LIST = [
  'Engineering',
  'Human Resources',
  'Product',
  'Marketing',
  'Design'
]


// Notification types
export const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: 'task_assigned',
  TASK_BLOCKED: 'task_blocked',
  TASK_COMPLETED: 'task_completed',
  TASK_OVERDUE: 'task_overdue',
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  EMPLOYEE_ADDED: 'employee_added',
  COMMENT_ADDED: 'comment_added',
}
