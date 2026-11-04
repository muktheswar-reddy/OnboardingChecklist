'use strict';

const express = require('express');
const router = express.Router();

const {
  getTasks,
  createTask,
  getTask,
  updateTask,
  updateTaskStatus,
  assignTask,
  blockTask,
  unblockTask,
  deleteTask,
} = require('../controllers/taskController');
const { addComment, getComments } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const {
  createTaskValidators,
  updateTaskStatusValidators,
  blockTaskValidators,
  assignTaskValidators,
} = require('../validators/taskValidators');

router.use(protect);

router
  .route('/')
  .get(getTasks)
  .post(authorize('admin', 'hr_manager', 'dept_manager'), createTaskValidators, validate, createTask);

router
  .route('/:id')
  .get(getTask)
  .put(authorize('admin', 'hr_manager', 'dept_manager'), updateTask)
  .delete(authorize('admin', 'hr_manager'), deleteTask);

router.patch('/:id/status', updateTaskStatusValidators, validate, updateTaskStatus);
router.patch('/:id/assign', authorize('admin', 'hr_manager', 'dept_manager'), assignTaskValidators, validate, assignTask);
router.patch('/:id/block', blockTaskValidators, validate, blockTask);
router.patch('/:id/unblock', authorize('admin', 'hr_manager', 'dept_manager'), unblockTask);

// Comments nested under tasks
router.route('/:id/comments').get(getComments).post(addComment);

module.exports = router;
