'use strict';

const Onboarding = require('../models/Onboarding');
const { successResponse } = require('../utils/apiResponse');

/**
 * @route   GET /api/reports/onboarding-csv
 * @access  Protected - admin, hr_manager
 */
const exportOnboardingCSV = async (req, res) => {
  const onboardings = await Onboarding.find()
    .populate('employee', 'name email employeeId jobTitle department phone joiningDate')
    .populate('template', 'name')
    .populate('tasks')
    .lean();

  const headers = [
    'Employee ID',
    'Employee Name',
    'Email',
    'Job Title',
    'Start Date',
    'Expected Completion',
    'Actual Completion',
    'Status',
    'Readiness Score',
    'Total Tasks',
    'Completed Tasks',
    'Blocked Tasks',
    'Template Name',
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const formatDate = (d) => (d ? new Date(d).toISOString().split('T')[0] : '');

  const rows = onboardings.map((o) => {
    const emp = o.employee || {};
    const tasks = o.tasks || [];
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const blockedTasks = tasks.filter((t) => t.status === 'blocked').length;

    return [
      emp.employeeId || '',
      emp.name || '',
      emp.email || '',
      emp.jobTitle || '',
      formatDate(o.startDate),
      formatDate(o.expectedCompletionDate),
      formatDate(o.actualCompletionDate),
      o.status || '',
      o.readinessScore || 0,
      tasks.length,
      completedTasks,
      blockedTasks,
      o.template ? o.template.name : '',
    ].map(escapeCSV).join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="onboarding-report-${Date.now()}.csv"`);
  res.send(csv);
};

module.exports = { exportOnboardingCSV };
