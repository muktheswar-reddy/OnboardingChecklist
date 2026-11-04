'use strict';

/**
 * Generate a unique employee ID in the format EMP-XXXX
 * @returns {string}
 */
const generateEmployeeId = () => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `EMP-${random}`;
};

/**
 * Calculate weighted readiness score from tasks array
 * @param {Array} tasks - Array of task objects with priority and status
 * @returns {number} Score 0-100
 */
const calculateReadinessScore = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;

  const weights = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  let totalWeight = 0;
  let completedWeight = 0;

  tasks.forEach((task) => {
    const w = weights[task.priority] || 1;
    totalWeight += w;
    if (task.status === 'completed') {
      completedWeight += w;
    }
  });

  return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
};

/**
 * Detect and mark overdue tasks (mutates task.status to 'overdue')
 * @param {Array} tasks - Array of task objects
 * @returns {Array} Tasks with updated overdue status
 */
const detectOverdueTasks = (tasks) => {
  if (!tasks || tasks.length === 0) return tasks;

  const now = new Date();

  return tasks.map((task) => {
    if (
      task.status !== 'completed' &&
      task.status !== 'blocked' &&
      task.dueDate &&
      new Date(task.dueDate) < now
    ) {
      task.status = 'overdue';
    }
    return task;
  });
};

/**
 * Build a Mongoose pagination object
 * @param {object} query - Mongoose Query
 * @param {number} page - Current page (1-indexed)
 * @param {number} limit - Items per page
 * @returns {object} { skip, limit }
 */
const paginate = (query, page, limit) => {
  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (p - 1) * l;
  return { skip, limit: l, page: p };
};

/**
 * Get the IP address from the request object
 * @param {object} req - Express request
 * @returns {string}
 */
const getIpAddress = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    'unknown'
  );
};

/**
 * Add days to a date
 * @param {Date} date
 * @param {number} days
 * @returns {Date}
 */
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Format date to ISO string without milliseconds
 * @param {Date} date
 * @returns {string}
 */
const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().split('T')[0];
};

module.exports = {
  generateEmployeeId,
  calculateReadinessScore,
  detectOverdueTasks,
  paginate,
  getIpAddress,
  addDays,
  formatDate,
};
