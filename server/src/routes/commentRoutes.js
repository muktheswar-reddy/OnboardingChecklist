'use strict';

const express = require('express');
const router = express.Router();

const { addComment, getComments } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// These routes are also accessible via /api/tasks/:id/comments in taskRoutes.js
// This file exposes a standalone comment route if needed
router.route('/tasks/:id/comments').get(getComments).post(addComment);

module.exports = router;
