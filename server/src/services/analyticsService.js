'use strict';

const Employee = require('../models/Employee');
const Onboarding = require('../models/Onboarding');
const Task = require('../models/Task');
const Department = require('../models/Department');

/**
 * Get high-level overview statistics
 */
const getOverviewStats = async () => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);

  const [
    totalEmployees,
    activeEmployees,
    onboardingEmployees,
    completedEmployees,
    totalOnboardings,
    completedOnboardings,
    inProgressOnboardings,
    delayedOnboardings,
    blockedTasks,
    overdueTasks,
    tasksDueToday,
    totalTasks,
    completedTasks,
  ] = await Promise.all([
    Employee.countDocuments(),
    Employee.countDocuments({ status: 'active' }),
    Employee.countDocuments({ status: 'onboarding' }),
    Employee.countDocuments({ status: 'completed' }),
    Onboarding.countDocuments(),
    Onboarding.countDocuments({ status: 'completed' }),
    Onboarding.countDocuments({ status: 'in_progress' }),
    Onboarding.countDocuments({ status: 'delayed' }),
    Task.countDocuments({ status: 'blocked' }),
    Task.countDocuments({ status: 'overdue' }),
    Task.countDocuments({
      dueDate: { $gte: startOfToday, $lt: endOfToday },
      status: { $nin: ['completed'] },
    }),
    Task.countDocuments(),
    Task.countDocuments({ status: 'completed' }),
  ]);

  return {
    employees: {
      total: totalEmployees,
      active: activeEmployees,
      onboarding: onboardingEmployees,
      completed: completedEmployees,
    },
    onboardings: {
      total: totalOnboardings,
      completed: completedOnboardings,
      inProgress: inProgressOnboardings,
      delayed: delayedOnboardings,
      notStarted: totalOnboardings - completedOnboardings - inProgressOnboardings - delayedOnboardings,
    },
    tasks: {
      total: totalTasks,
      completed: completedTasks,
      blocked: blockedTasks,
      overdue: overdueTasks,
      dueToday: tasksDueToday,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    },
  };
};

/**
 * Get statistics grouped by department
 */
const getDepartmentStats = async () => {
  const departments = await Department.find();

  const stats = await Promise.all(
    departments.map(async (dept) => {
      const [empCount, onboardingCount, completedCount, taskCount, blockedCount] = await Promise.all([
        Employee.countDocuments({ department: dept._id }),
        Employee.countDocuments({ department: dept._id, status: 'onboarding' }),
        Employee.countDocuments({ department: dept._id, status: 'completed' }),
        Task.countDocuments({ department: dept._id }),
        Task.countDocuments({ department: dept._id, status: 'blocked' }),
      ]);

      // More reliable query using aggregation
      const onboardingStats = await Employee.aggregate([
        { $match: { department: dept._id } },
        {
          $lookup: {
            from: 'onboardings',
            localField: 'onboarding',
            foreignField: '_id',
            as: 'onboardingData',
          },
        },
        { $unwind: { path: '$onboardingData', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$onboardingData.status',
            count: { $sum: 1 },
          },
        },
      ]);

      const statusMap = {};
      onboardingStats.forEach((s) => {
        if (s._id) statusMap[s._id] = s.count;
      });

      return {
        department: { id: dept._id, name: dept.name },
        employees: empCount,
        onboardings: {
          completed: statusMap['completed'] || 0,
          inProgress: statusMap['in_progress'] || 0,
          delayed: statusMap['delayed'] || 0,
          notStarted: statusMap['not_started'] || 0,
        },
        tasks: {
          total: taskCount,
          blocked: blockedCount,
        },
      };
    })
  );

  return stats;
};

/**
 * Get statistics grouped by job role / task category
 */
const getRoleStats = async () => {
  const roleStats = await Task.aggregate([
    {
      $group: {
        _id: '$category',
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
        },
        blocked: {
          $sum: { $cond: [{ $eq: ['$status', 'blocked'] }, 1, 0] },
        },
        overdue: {
          $sum: { $cond: [{ $eq: ['$status', 'overdue'] }, 1, 0] },
        },
      },
    },
    { $sort: { total: -1 } },
  ]);

  return roleStats.map((r) => ({
    category: r._id,
    total: r.total,
    completed: r.completed,
    blocked: r.blocked,
    overdue: r.overdue,
    completionRate: r.total > 0 ? Math.round((r.completed / r.total) * 100) : 0,
  }));
};

/**
 * Get blocker statistics
 */
const getBlockerStats = async () => {
  const blockedTasks = await Task.find({ status: 'blocked' })
    .populate('employee', 'name employeeId')
    .populate('assignedOwner', 'name email')
    .populate('department', 'name')
    .populate('blockedBy', 'name email')
    .select('title blockerReason blockedAt department employee assignedOwner blockedBy priority')
    .sort({ blockedAt: -1 })
    .limit(50);

  const totalBlocked = await Task.countDocuments({ status: 'blocked' });

  // Average time blocked (in hours)
  const blockedWithTime = blockedTasks.filter((t) => t.blockedAt);
  const avgBlockedHours =
    blockedWithTime.length > 0
      ? blockedWithTime.reduce((sum, t) => {
          const diff = Date.now() - new Date(t.blockedAt).getTime();
          return sum + diff / (1000 * 60 * 60);
        }, 0) / blockedWithTime.length
      : 0;

  return {
    totalBlocked,
    avgBlockedHours: Math.round(avgBlockedHours),
    blockedTasks,
  };
};

/**
 * Get average onboarding duration in days
 */
const getAverageOnboardingDuration = async () => {
  const result = await Onboarding.aggregate([
    {
      $match: {
        status: 'completed',
        actualCompletionDate: { $exists: true, $ne: null },
        startDate: { $exists: true, $ne: null },
      },
    },
    {
      $project: {
        durationDays: {
          $divide: [
            { $subtract: ['$actualCompletionDate', '$startDate'] },
            1000 * 60 * 60 * 24,
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        avgDuration: { $avg: '$durationDays' },
        minDuration: { $min: '$durationDays' },
        maxDuration: { $max: '$durationDays' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (result.length === 0) {
    return { avgDuration: 0, minDuration: 0, maxDuration: 0, count: 0 };
  }

  return {
    avgDuration: Math.round(result[0].avgDuration),
    minDuration: Math.round(result[0].minDuration),
    maxDuration: Math.round(result[0].maxDuration),
    count: result[0].count,
  };
};

module.exports = {
  getOverviewStats,
  getDepartmentStats,
  getRoleStats,
  getBlockerStats,
  getAverageOnboardingDuration,
};
