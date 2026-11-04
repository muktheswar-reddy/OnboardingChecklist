'use strict';

const express = require('express');
const router = express.Router();

const {
  getEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createEmployeeValidators, updateEmployeeValidators } = require('../validators/employeeValidators');

router.use(protect);

router
  .route('/')
  .get(authorize('admin', 'hr_manager', 'dept_manager'), getEmployees)
  .post(authorize('admin', 'hr_manager'), createEmployeeValidators, validate, createEmployee);

router
  .route('/:id')
  .get(authorize('admin', 'hr_manager', 'dept_manager', 'it_team'), getEmployee)
  .put(authorize('admin', 'hr_manager'), updateEmployeeValidators, validate, updateEmployee)
  .delete(authorize('admin'), deleteEmployee);

module.exports = router;
