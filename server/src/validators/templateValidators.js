'use strict';

const { body } = require('express-validator');

const taskDefinitionValidator = [
  body('taskDefinitions.*.title')
    .trim()
    .notEmpty().withMessage('Task definition title is required')
    .isLength({ max: 200 }).withMessage('Task title cannot exceed 200 characters'),

  body('taskDefinitions.*.category')
    .notEmpty().withMessage('Task definition category is required')
    .isIn(['IT', 'HR', 'Training', 'Workplace'])
    .withMessage('Invalid task category'),

  body('taskDefinitions.*.priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority'),

  body('taskDefinitions.*.dueOffsetDays')
    .optional()
    .isInt({ min: 0 }).withMessage('Due offset days must be a non-negative integer'),
];

const createTemplateValidators = [
  body('name')
    .trim()
    .notEmpty().withMessage('Template name is required')
    .isLength({ max: 200 }).withMessage('Template name cannot exceed 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),

  body('jobRole')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Job role cannot exceed 100 characters'),

  body('estimatedDuration')
    .optional()
    .isInt({ min: 1 }).withMessage('Estimated duration must be at least 1 day'),

  body('isDefault')
    .optional()
    .isBoolean().withMessage('isDefault must be a boolean'),

  body('taskDefinitions')
    .optional()
    .isArray().withMessage('Task definitions must be an array'),

  ...taskDefinitionValidator,
];

const updateTemplateValidators = [
  body('name')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Template name cannot exceed 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),

  body('estimatedDuration')
    .optional()
    .isInt({ min: 1 }).withMessage('Estimated duration must be at least 1 day'),

  body('isDefault')
    .optional()
    .isBoolean().withMessage('isDefault must be a boolean'),

  body('taskDefinitions')
    .optional()
    .isArray().withMessage('Task definitions must be an array'),

  ...taskDefinitionValidator,
];

module.exports = { createTemplateValidators, updateTemplateValidators };
