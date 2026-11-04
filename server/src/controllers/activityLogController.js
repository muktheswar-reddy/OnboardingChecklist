'use strict';

const ActivityLog = require('../models/ActivityLog');
const { successResponse, paginatedResponse } = require('../utils/apiResponse');
const { paginate } = require('../utils/helpers');

/**
 * @route   GET /api/activity
 * @access  Protected - admin, hr_manager
 */
const getLogs = async (req, res) => {
  const {
    page = 1,
    limit = 20,
    actor,
    action,
    entityType,
    entityId,
    sort = '-createdAt',
  } = req.query;

  const { skip, limit: lim, page: pg } = paginate(null, page, limit);

  const filter = {};
  if (actor) filter.actor = actor;
  if (action) filter.action = { $regex: action, $options: 'i' };
  if (entityType) filter.entityType = entityType;
  if (entityId) filter.entityId = entityId;

  const [logs, total] = await Promise.all([
    ActivityLog.find(filter)
      .populate('actor', 'name email role')
      .sort(sort)
      .skip(skip)
      .limit(lim),
    ActivityLog.countDocuments(filter),
  ]);

  return paginatedResponse(res, logs, total, pg, lim, 'Activity logs retrieved');
};

module.exports = { getLogs };
