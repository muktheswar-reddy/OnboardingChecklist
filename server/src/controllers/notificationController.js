'use strict';

const Notification = require('../models/Notification');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { paginate } = require('../utils/helpers');

/**
 * @route   GET /api/notifications
 * @access  Protected
 */
const getNotifications = async (req, res) => {
  const { page = 1, limit = 20, isRead, type } = req.query;
  const { skip, limit: lim, page: pg } = paginate(null, page, limit);

  const filter = { recipient: req.user._id };
  if (isRead === 'true') filter.isRead = true;
  if (isRead === 'false') filter.isRead = false;
  if (type) filter.type = type;

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(lim),
    Notification.countDocuments(filter),
  ]);

  return paginatedResponse(res, notifications, total, pg, lim, 'Notifications retrieved');
};

/**
 * @route   PATCH /api/notifications/:id/read
 * @access  Protected
 */
const markRead = async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user._id,
  });

  if (!notification) {
    return errorResponse(res, 'Notification not found', 404);
  }

  notification.isRead = true;
  await notification.save();

  return successResponse(res, notification, 'Notification marked as read');
};

/**
 * @route   PATCH /api/notifications/read-all
 * @access  Protected
 */
const markAllRead = async (req, res) => {
  const result = await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { $set: { isRead: true } }
  );

  return successResponse(
    res,
    { modifiedCount: result.modifiedCount },
    'All notifications marked as read'
  );
};

/**
 * @route   GET /api/notifications/unread-count
 * @access  Protected
 */
const getUnreadCount = async (req, res) => {
  const count = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false,
  });

  return successResponse(res, { count }, 'Unread count retrieved');
};

module.exports = { getNotifications, markRead, markAllRead, getUnreadCount };
