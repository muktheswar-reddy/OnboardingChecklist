'use strict';

const { errorResponse } = require('../utils/apiResponse');

/**
 * authorize - Check req.user.role against allowed roles
 * @param  {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Not authenticated', 401);
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Access denied — role '${req.user.role}' is not authorized for this action`,
        403
      );
    }

    next();
  };
};

module.exports = { authorize };
