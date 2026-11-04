'use strict';

const {
  getOverviewStats,
  getDepartmentStats,
  getRoleStats,
  getBlockerStats,
  getAverageOnboardingDuration,
} = require('../services/analyticsService');
const { successResponse } = require('../utils/apiResponse');

/**
 * @route   GET /api/analytics/overview
 * @access  Protected - admin, hr_manager
 */
const getOverview = async (req, res) => {
  const [overview, avgDuration] = await Promise.all([
    getOverviewStats(),
    getAverageOnboardingDuration(),
  ]);
  return successResponse(res, { ...overview, averageOnboardingDuration: avgDuration }, 'Overview stats retrieved');
};

/**
 * @route   GET /api/analytics/departments
 * @access  Protected - admin, hr_manager
 */
const getDepartments = async (req, res) => {
  const stats = await getDepartmentStats();
  return successResponse(res, stats, 'Department stats retrieved');
};

/**
 * @route   GET /api/analytics/roles
 * @access  Protected - admin, hr_manager
 */
const getRoles = async (req, res) => {
  const stats = await getRoleStats();
  return successResponse(res, stats, 'Role/category stats retrieved');
};

/**
 * @route   GET /api/analytics/blockers
 * @access  Protected - admin, hr_manager, dept_manager
 */
const getBlockers = async (req, res) => {
  const stats = await getBlockerStats();
  return successResponse(res, stats, 'Blocker stats retrieved');
};

module.exports = { getOverview, getDepartments, getRoles, getBlockers };
