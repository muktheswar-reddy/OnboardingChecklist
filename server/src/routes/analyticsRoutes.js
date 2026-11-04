'use strict';

const express = require('express');
const router = express.Router();

const { getOverview, getDepartments, getRoles, getBlockers } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.use(authorize('admin', 'hr_manager', 'dept_manager'));

router.get('/overview', getOverview);
router.get('/departments', getDepartments);
router.get('/roles', getRoles);
router.get('/blockers', getBlockers);

module.exports = router;
