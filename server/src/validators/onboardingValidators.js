'use strict';

const { body } = require('express-validator');

const createOnboardingValidators = [
  body('employee')
    .notEmpty().withMessage('Employee ID is required')
    .isMongoId().withMessage('Invalid employee ID'),

  body('template')
    .optional()
    .isMongoId().withMessage('Invalid template ID'),

  body('startDate')
    .optional()
    .isISO8601().withMessage('Start date must be a valid date'),

  body('expectedCompletionDate')
    .optional()
    .isISO8601().withMessage('Expected completion date must be a valid date'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Notes cannot exceed 2000 characters'),
];

const updateOnboardingValidators = [
  body('status')
    .optional()
    .isIn(['not_started', 'in_progress', 'completed', 'delayed'])
    .withMessage('Invalid status'),

  body('expectedCompletionDate')
    .optional()
    .isISO8601().withMessage('Expected completion date must be a valid date'),

  body('actualCompletionDate')
    .optional()
    .isISO8601().withMessage('Actual completion date must be a valid date'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Notes cannot exceed 2000 characters'),
];

module.exports = { createOnboardingValidators, updateOnboardingValidators };
