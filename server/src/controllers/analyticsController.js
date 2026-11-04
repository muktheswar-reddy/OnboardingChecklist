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

  const responseData = {
    ...overview,
    totalEmployees: overview.employees.total,
    activeEmployees: overview.employees.active,
    onboardingEmployees: overview.employees.onboarding,
    completedEmployees: overview.onboardings.completed,
    inProgressEmployees: overview.onboardings.inProgress,
    delayedEmployees: overview.onboardings.delayed,
    totalOnboardings: overview.onboardings.total,
    totalTasks: overview.tasks.total,
    completedTasks: overview.tasks.completed,
    blockedTasks: overview.tasks.blocked,
    overdueTasks: overview.tasks.overdue,
    tasksDueToday: overview.tasks.dueToday,
    averageReadinessScore: overview.tasks.completionRate,
    averageOnboardingDuration: avgDuration,
  };

  return successResponse(res, responseData, 'Overview stats retrieved');
};

/**
 * @route   GET /api/analytics/departments
 * @access  Protected - admin, hr_manager
 */
const getDepartments = async (req, res) => {
  const stats = await getDepartmentStats();
  const mapped = stats.map((s) => ({
    ...s,
    _id: s.department?.id || s.department,
    name: s.department?.name || s.name || 'Department',
    department: s.department?.name || s.name || 'Department',
    totalCount: s.tasks?.total || 0,
    completedCount: s.onboardings?.completed || Math.max(0, (s.tasks?.total || 0) - (s.tasks?.blocked || 0)),
    inProgressCount: s.onboardings?.inProgress || 0,
    delayedCount: s.onboardings?.delayed || 0,
    blockedCount: s.tasks?.blocked || 0,
    completionRate: (s.tasks?.total || 0) > 0
      ? Math.round((Math.max(0, (s.tasks.total - (s.tasks.blocked || 0))) / s.tasks.total) * 100)
      : 0,
  }));
  return successResponse(res, mapped, 'Department stats retrieved');
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
