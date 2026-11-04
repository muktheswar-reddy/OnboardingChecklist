'use strict';

const express = require('express');
const router = express.Router();

const {
  getOnboardings,
  createOnboarding,
  getOnboarding,
  updateOnboarding,
  deleteOnboarding,
} = require('../controllers/onboardingController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createOnboardingValidators, updateOnboardingValidators } = require('../validators/onboardingValidators');

router.use(protect);

router
  .route('/')
  .get(authorize('admin', 'hr_manager', 'dept_manager', 'it_team'), getOnboardings)
  .post(authorize('admin', 'hr_manager'), createOnboardingValidators, validate, createOnboarding);

router
  .route('/:id')
  .get(authorize('admin', 'hr_manager', 'dept_manager', 'it_team', 'employee'), getOnboarding)
  .put(authorize('admin', 'hr_manager'), updateOnboardingValidators, validate, updateOnboarding)
  .delete(authorize('admin'), deleteOnboarding);

module.exports = router;
