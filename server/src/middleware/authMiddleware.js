'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/apiResponse');

/**
 * protect - Verify JWT token and attach req.user
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return errorResponse(res, 'Not authorized — no token provided', 401);
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id).populate('department');
    if (!user) {
      return errorResponse(res, 'Not authorized — user not found', 401);
    }

    if (!user.isActive) {
      return errorResponse(res, 'Your account has been deactivated', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token has expired — please log in again', 401);
    }
    if (err.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid token — please log in again', 401);
    }
    return errorResponse(res, 'Not authorized', 401);
  }
};

/**
 * optionalAuth - Attach user if token present, don't fail if not
 */
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).populate('department');
    req.user = user && user.isActive ? user : null;
  } catch {
    req.user = null;
  }

  next();
};

module.exports = { protect, optionalAuth };
