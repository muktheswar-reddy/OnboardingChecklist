'use strict';

const jwt = require('jsonwebtoken');

const getSecret = () => process.env.JWT_SECRET || 'fallback_secret_change_in_production';
const getExpire = () => process.env.JWT_EXPIRE || '7d';

/**
 * Generate a signed JWT token
 * @param {string} userId - MongoDB ObjectId of the user
 * @param {string} role - User role
 * @returns {string} JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, getSecret(), {
    expiresIn: getExpire(),
    issuer: 'onboarding-checklist',
  });
};

/**
 * Verify and decode a JWT token
 * @param {string} token
 * @returns {object} Decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, getSecret(), { issuer: 'onboarding-checklist' });
};

module.exports = { generateToken, verifyToken };
