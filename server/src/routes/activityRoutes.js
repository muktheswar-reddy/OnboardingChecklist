'use strict';

const express = require('express');
const router = express.Router();

const { getLogs } = require('../controllers/activityLogController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);
router.get('/', authorize('admin', 'hr_manager'), getLogs);

module.exports = router;
