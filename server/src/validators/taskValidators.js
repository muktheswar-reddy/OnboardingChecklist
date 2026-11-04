'use strict';

const { body } = require('express-validator');

const createTaskValidators = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),

  body('onboarding')
    .notEmpty().withMessage('Onboarding ID is required')
    .isMongoId().withMessage('Invalid onboarding ID'),

  body('employee')
    .notEmpty().withMessage('Employee ID is required')
    .isMongoId().withMessage('Invalid employee ID'),

  body('assignedOwner')
    .optional()
    .isMongoId().withMessage('Invalid assigned owner ID'),

  body('department')
    .optional()
    .isMongoId().withMessage('Invalid department ID'),

  body('category')
    .optional()
    .isIn(['IT', 'HR', 'Training', 'Workplace', 'Other'])
    .withMessage('Invalid category'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority'),

  body('dueDate')
    .notEmpty().withMessage('Due date is required')
    .isISO8601().withMessage('Due date must be a valid date'),
];

const updateTaskStatusValidators = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['not_started', 'in_progress', 'completed', 'blocked', 'overdue'])
    .withMessage('Invalid status'),
];

const blockTaskValidators = [
  body('blockerReason')
    .trim()
    .notEmpty().withMessage('Blocker reason is required')
    .isLength({ max: 1000 }).withMessage('Blocker reason cannot exceed 1000 characters'),
];

const assignTaskValidators = [
  body('assignedOwner')
    .notEmpty().withMessage('Assigned owner ID is required')
    .isMongoId().withMessage('Invalid assigned owner ID'),
];

module.exports = {
  createTaskValidators,
  updateTaskStatusValidators,
  blockTaskValidators,
  assignTaskValidators,
};
