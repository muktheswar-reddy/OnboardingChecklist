'use strict';

const Onboarding = require('../models/Onboarding');
const Employee = require('../models/Employee');
const Template = require('../models/Template');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');
const { generateChecklistFromTemplate } = require('../services/checklistService');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { paginate, calculateReadinessScore, getIpAddress } = require('../utils/helpers');

/**
 * @route   GET /api/onboardings
 * @access  Protected
 */
const getOnboardings = async (req, res) => {
  const { page = 1, limit = 10, status, department, search, sort = '-createdAt' } = req.query;
  const { skip, limit: lim, page: pg } = paginate(null, page, limit);

  const filter = {};
  if (status) filter.status = status;

  if (department) {
    const employees = await Employee.find({ department }).select('_id');
    filter.employee = { $in: employees.map((e) => e._id) };
  }

  if (search) {
    // Search by employee name
    const employees = await Employee.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
      ],
    }).select('_id');
    filter.employee = { $in: employees.map((e) => e._id) };
  }

  const [onboardings, total] = await Promise.all([
    Onboarding.find(filter)
      .populate('employee', 'name email employeeId department jobTitle')
      .populate('template', 'name')
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(lim),
    Onboarding.countDocuments(filter),
  ]);

  return paginatedResponse(res, onboardings, total, pg, lim, 'Onboardings retrieved');
};

/**
 * @route   POST /api/onboardings
 * @access  Protected - admin, hr_manager
 */
const createOnboarding = async (req, res) => {
  const { employee: employeeId, template: templateId, startDate, expectedCompletionDate, notes } = req.body;

  const employee = await Employee.findById(employeeId);
  if (!employee) {
    return errorResponse(res, 'Employee not found', 404);
  }

  // Check if employee already has an onboarding
  const existing = await Onboarding.findOne({ employee: employeeId });
  if (existing) {
    return errorResponse(res, 'Employee already has an onboarding record', 409);
  }

  let template = null;
  if (templateId) {
    template = await Template.findById(templateId);
    if (!template) {
      return errorResponse(res, 'Template not found', 404);
    }
  } else {
    template = await Template.findOne({ isDefault: true });
  }

  const start = startDate ? new Date(startDate) : employee.joiningDate || new Date();
  const expectedEnd = expectedCompletionDate
    ? new Date(expectedCompletionDate)
    : template
    ? new Date(start.getTime() + template.estimatedDuration * 24 * 60 * 60 * 1000)
    : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);

  const onboarding = await Onboarding.create({
    employee: employeeId,
    template: template ? template._id : null,
    startDate: start,
    expectedCompletionDate: expectedEnd,
    status: 'in_progress',
    notes: notes || '',
    createdBy: req.user._id,
  });

  if (template) {
    await generateChecklistFromTemplate(
      onboarding._id,
      template,
      employeeId,
      start,
      employee.department
    );
  }

  // Update employee's onboarding reference
  await Employee.findByIdAndUpdate(employeeId, {
    onboarding: onboarding._id,
    status: 'onboarding',
  });

  await ActivityLog.create({
    actor: req.user._id,
    action: 'ONBOARDING_CREATED',
    entityType: 'Onboarding',
    entityId: onboarding._id,
    description: `Onboarding created for employee: ${employee.name}`,
    ipAddress: getIpAddress(req),
  });

  const populated = await Onboarding.findById(onboarding._id)
    .populate('employee', 'name email employeeId')
    .populate('template', 'name taskDefinitions')
    .populate('tasks');

  return successResponse(res, populated, 'Onboarding created successfully', 201);
};

/**
 * @route   GET /api/onboardings/:id
 * @access  Protected
 */
const getOnboarding = async (req, res) => {
  const onboarding = await Onboarding.findById(req.params.id)
    .populate('employee', 'name email employeeId jobTitle department phone')
    .populate('template', 'name description estimatedDuration')
    .populate('createdBy', 'name email')
    .populate({
      path: 'tasks',
      populate: [
        { path: 'assignedOwner', select: 'name email role' },
        { path: 'department', select: 'name' },
        { path: 'blockedBy', select: 'name email' },
      ],
    });

  if (!onboarding) {
    return errorResponse(res, 'Onboarding not found', 404);
  }

  // Calculate readiness score from populated tasks
  if (onboarding.tasks && onboarding.tasks.length > 0) {
    const score = calculateReadinessScore(onboarding.tasks);
    if (score !== onboarding.readinessScore) {
      await Onboarding.findByIdAndUpdate(req.params.id, { readinessScore: score });
      onboarding.readinessScore = score;
    }
  }

  return successResponse(res, onboarding, 'Onboarding retrieved');
};

/**
 * @route   PUT /api/onboardings/:id
 * @access  Protected - admin, hr_manager
 */
const updateOnboarding = async (req, res) => {
  const { status, expectedCompletionDate, actualCompletionDate, notes } = req.body;

  const existing = await Onboarding.findById(req.params.id);
  if (!existing) {
    return errorResponse(res, 'Onboarding not found', 404);
  }

  const updateData = {};
  if (status !== undefined) updateData.status = status;
  if (expectedCompletionDate) updateData.expectedCompletionDate = expectedCompletionDate;
  if (actualCompletionDate) updateData.actualCompletionDate = actualCompletionDate;
  if (notes !== undefined) updateData.notes = notes;

  if (status === 'completed' && !existing.actualCompletionDate) {
    updateData.actualCompletionDate = new Date();
    // Update employee status
    await Employee.findByIdAndUpdate(existing.employee, { status: 'completed' });
  }

  const updated = await Onboarding.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate('employee', 'name email employeeId')
    .populate('template', 'name');

  await ActivityLog.create({
    actor: req.user._id,
    action: 'ONBOARDING_UPDATED',
    entityType: 'Onboarding',
    entityId: existing._id,
    previousValue: { status: existing.status },
    newValue: updateData,
    description: `Onboarding updated for employee ${existing.employee}`,
    ipAddress: getIpAddress(req),
  });

  return successResponse(res, updated, 'Onboarding updated successfully');
};

/**
 * @route   DELETE /api/onboardings/:id
 * @access  Protected - admin
 */
const deleteOnboarding = async (req, res) => {
  const onboarding = await Onboarding.findById(req.params.id);
  if (!onboarding) {
    return errorResponse(res, 'Onboarding not found', 404);
  }

  // Remove all associated tasks
  await Task.deleteMany({ onboarding: req.params.id });

  // Remove onboarding reference from employee
  await Employee.findByIdAndUpdate(onboarding.employee, {
    $unset: { onboarding: 1 },
    status: 'active',
  });

  await Onboarding.findByIdAndDelete(req.params.id);

  await ActivityLog.create({
    actor: req.user._id,
    action: 'ONBOARDING_DELETED',
    entityType: 'Onboarding',
    entityId: onboarding._id,
    description: `Onboarding deleted for employee ${onboarding.employee}`,
    ipAddress: getIpAddress(req),
  });

  return successResponse(res, null, 'Onboarding deleted successfully');
};

module.exports = { getOnboardings, createOnboarding, getOnboarding, updateOnboarding, deleteOnboarding };
