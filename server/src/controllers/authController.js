'use strict';

const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');
const { generateToken } = require('../utils/jwtUtils');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { getIpAddress } = require('../utils/helpers');

/**
 * @route   POST /api/auth/register
 * @access  Public (or Admin-only depending on config)
 */
const register = async (req, res) => {
  const { name, email, password, role, department } = req.body;

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return errorResponse(res, 'An account with this email already exists', 409);
  }

  const user = await User.create({
    name,
    email,
    passwordHash: password,
    role: role || 'employee',
    department: department || null,
  });

  const token = generateToken(user._id, user.role);

  await ActivityLog.create({
    actor: user._id,
    action: 'USER_REGISTERED',
    entityType: 'User',
    entityId: user._id,
    description: `New user registered: ${user.email}`,
    ipAddress: getIpAddress(req),
  });

  return successResponse(
    res,
    { token, user: user.toJSON() },
    'Registration successful',
    201
  );
};

/**
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findByEmail(email);
  if (!user) {
    return errorResponse(res, 'Invalid email or password', 401);
  }

  if (!user.isActive) {
    return errorResponse(res, 'Your account has been deactivated. Please contact support.', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return errorResponse(res, 'Invalid email or password', 401);
  }

  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id, user.role);

  await ActivityLog.create({
    actor: user._id,
    action: 'USER_LOGIN',
    entityType: 'User',
    entityId: user._id,
    description: `User logged in: ${user.email}`,
    ipAddress: getIpAddress(req),
  });

  return successResponse(res, { token, user: user.toJSON() }, 'Login successful');
};

/**
 * @route   GET /api/auth/me
 * @access  Protected
 */
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate('department');
  if (!user) {
    return errorResponse(res, 'User not found', 404);
  }
  return successResponse(res, user.toJSON(), 'Profile retrieved');
};

/**
 * @route   POST /api/auth/logout
 * @access  Protected
 */
const logout = async (req, res) => {
  // For stateless JWT, logout is handled client-side by deleting the token.
  // Record a logout event for audit trail.
  await ActivityLog.create({
    actor: req.user._id,
    action: 'USER_LOGOUT',
    entityType: 'User',
    entityId: req.user._id,
    description: `User logged out: ${req.user.email}`,
    ipAddress: getIpAddress(req),
  });

  // If using cookies, clear them
  if (req.cookies && req.cookies.token) {
    res.clearCookie('token');
  }

  return successResponse(res, null, 'Logged out successfully');
};

module.exports = { register, login, getMe, logout };
