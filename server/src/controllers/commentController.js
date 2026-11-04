'use strict';

const Comment = require('../models/Comment');
const Task = require('../models/Task');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { paginate } = require('../utils/helpers');

/**
 * @route   POST /api/tasks/:id/comments
 * @access  Protected
 */
const addComment = async (req, res) => {
  const { content } = req.body;

  if (!content || !content.trim()) {
    return errorResponse(res, 'Comment content is required', 400);
  }

  const task = await Task.findById(req.params.id);
  if (!task) {
    return errorResponse(res, 'Task not found', 404);
  }

  const comment = await Comment.create({
    task: task._id,
    author: req.user._id,
    content: content.trim(),
  });

  // Add comment reference to task
  await Task.findByIdAndUpdate(task._id, { $push: { comments: comment._id } });

  const populated = await Comment.findById(comment._id).populate('author', 'name email role avatar');

  return successResponse(res, populated, 'Comment added successfully', 201);
};

/**
 * @route   GET /api/tasks/:id/comments
 * @access  Protected
 */
const getComments = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const { skip, limit: lim, page: pg } = paginate(null, page, limit);

  const task = await Task.findById(req.params.id);
  if (!task) {
    return errorResponse(res, 'Task not found', 404);
  }

  const [comments, total] = await Promise.all([
    Comment.find({ task: req.params.id })
      .populate('author', 'name email role avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(lim),
    Comment.countDocuments({ task: req.params.id }),
  ]);

  return paginatedResponse(res, comments, total, pg, lim, 'Comments retrieved');
};

module.exports = { addComment, getComments };
