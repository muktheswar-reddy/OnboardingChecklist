'use strict';

const { body, query } = require('express-validator');

const createEmployeeValidators = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('jobTitle')
    .trim()
    .notEmpty().withMessage('Job title is required')
    .isLength({ max: 100 }).withMessage('Job title cannot exceed 100 characters'),

  body('department')
    .notEmpty().withMessage('Department is required')
    .isMongoId().withMessage('Invalid department ID'),

  body('joiningDate')
    .optional()
    .isISO8601().withMessage('Joining date must be a valid date'),

  body('manager')
    .optional()
    .isMongoId().withMessage('Invalid manager ID'),

  body('phone')
    .optional()
    .trim()
    .matches(/^[\+]?[0-9\s\-\(\)]{7,20}$/).withMessage('Please provide a valid phone number'),

  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const updateEmployeeValidators = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('jobTitle')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Job title cannot exceed 100 characters'),

  body('department')
    .optional()
    .isMongoId().withMessage('Invalid department ID'),

  body('status')
    .optional()
    .isIn(['active', 'inactive', 'onboarding', 'completed'])
    .withMessage('Invalid status'),

  body('phone')
    .optional()
    .trim()
    .matches(/^[\+]?[0-9\s\-\(\)]{7,20}$/).withMessage('Please provide a valid phone number'),
];

module.exports = { createEmployeeValidators, updateEmployeeValidators };
