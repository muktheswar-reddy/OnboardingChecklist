'use strict';

const express = require('express');
const router = express.Router();

const {
  getTemplates,
  createTemplate,
  getTemplate,
  updateTemplate,
  deleteTemplate,
} = require('../controllers/templateController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createTemplateValidators, updateTemplateValidators } = require('../validators/templateValidators');

router.use(protect);

router
  .route('/')
  .get(getTemplates)
  .post(authorize('admin', 'hr_manager'), createTemplateValidators, validate, createTemplate);

router
  .route('/:id')
  .get(getTemplate)
  .put(authorize('admin', 'hr_manager'), updateTemplateValidators, validate, updateTemplate)
  .delete(authorize('admin'), deleteTemplate);

module.exports = router;
