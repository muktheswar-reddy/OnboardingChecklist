'use strict';

const express = require('express');
const router = express.Router();

const { exportOnboardingCSV } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.get('/onboarding-csv', authorize('admin', 'hr_manager'), exportOnboardingCSV);

module.exports = router;
