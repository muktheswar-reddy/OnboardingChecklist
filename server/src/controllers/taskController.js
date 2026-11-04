'use strict';

const Task = require('../models/Task');
const Onboarding = require('../models/Onboarding');
const Employee = require('../models/Employee');
const ActivityLog = require('../models/ActivityLog');
const { notifyTaskAssigned, notifyBlockerCreated, notifyBlockerResolved, notifyOnboardingCompleted } = require('../services/notificationService');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { paginate, calculateReadinessScore, getIpAddress } = require('../utils/helpers');

const VALID_TRANSITIONS = {
  not_started: ['in_progress', 'blocked'],
  in_progress: ['completed', 'blocked', 'overdue'],
  blocked: ['in_progress', 'not_started'],
  overdue: ['in_progress', 'completed', 'blocked'],
  completed: [],
};

/**
 * @route   GET /api/tasks
 * @access  Protected
 */
const getTasks = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    priority,
    department,
    employee,
    assignedOwner,
    onboarding,
    overdue,
    blocked,
    category,
    sort = '-createdAt',
  } = req.query;

  const { skip, limit: lim, page: pg } = paginate(null, page, limit);
  const filter = {};

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (department) filter.department = department;
  if (employee) filter.employee = employee;
  if (assignedOwner) filter.assignedOwner = assignedOwner;
  if (onboarding) filter.onboarding = onboarding;
  if (category) filter.category = category;
  if (overdue === 'true') filter.status = 'overdue';
  if (blocked === 'true') filter.status = 'blocked';

  // Non-admin users see only their assigned tasks
  if (req.user.role === 'employee') {
    // Find associated employee record
    const emp = await Employee.findOne({ user: req.user._id });
    if (emp) filter.employee = emp._id;
  }

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate('employee', 'name email employeeId')
      .populate('assignedOwner', 'name email role')
      .populate('department', 'name')
      .populate('blockedBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(lim),
    Task.countDocuments(filter),
  ]);

  return paginatedResponse(res, tasks, total, pg, lim, 'Tasks retrieved');
};

/**
 * @route   POST /api/tasks
 * @access  Protected - admin, hr_manager, dept_manager
 */
const createTask = async (req, res) => {
  const { title, description, onboarding, employee, assignedOwner, department, category, priority, dueDate } = req.body;

  const onboardingDoc = await Onboarding.findById(onboarding);
  if (!onboardingDoc) {
    return errorResponse(res, 'Onboarding not found', 404);
  }

  const task = await Task.create({
    title,
    description: description || '',
    onboarding,
    employee,
    assignedOwner: assignedOwner || null,
    department: department || null,
    category: category || 'Other',
    priority: priority || 'medium',
    dueDate,
    status: 'not_started',
  });

  // Add task to onboarding
  await Onboarding.findByIdAndUpdate(onboarding, { $push: { tasks: task._id } });

  // Notify assigned owner
  if (assignedOwner) {
    await notifyTaskAssigned(task);
  }

  await ActivityLog.create({
    actor: req.user._id,
    action: 'TASK_CREATED',
    entityType: 'Task',
    entityId: task._id,
    newValue: { title, status: 'not_started' },
    description: `Task created: "${title}"`,
    ipAddress: getIpAddress(req),
  });

  const populated = await Task.findById(task._id)
    .populate('employee', 'name email employeeId')
    .populate('assignedOwner', 'name email role')
    .populate('department', 'name');

  return successResponse(res, populated, 'Task created successfully', 201);
};

/**
 * @route   GET /api/tasks/:id
 * @access  Protected
 */
const getTask = async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate('employee', 'name email employeeId')
    .populate('assignedOwner', 'name email role')
    .populate('department', 'name')
    .populate('blockedBy', 'name email')
    .populate({
      path: 'comments',
      populate: { path: 'author', select: 'name email role' },
    });

  if (!task) {
    return errorResponse(res, 'Task not found', 404);
  }

  return successResponse(res, task, 'Task retrieved');
};

/**
 * @route   PUT /api/tasks/:id
 * @access  Protected
 */
const updateTask = async (req, res) => {
  const allowedFields = ['title', 'description', 'assignedOwner', 'department', 'category', 'priority', 'dueDate'];
  const updateData = {};
  allowedFields.forEach((f) => {
    if (req.body[f] !== undefined) updateData[f] = req.body[f];
  });

  const existing = await Task.findById(req.params.id);
  if (!existing) {
    return errorResponse(res, 'Task not found', 404);
  }

  const task = await Task.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate('employee', 'name email')
    .populate('assignedOwner', 'name email role');

  await ActivityLog.create({
    actor: req.user._id,
    action: 'TASK_UPDATED',
    entityType: 'Task',
    entityId: task._id,
    previousValue: existing.toObject(),
    newValue: updateData,
    description: `Task updated: "${task.title}"`,
    ipAddress: getIpAddress(req),
  });

  return successResponse(res, task, 'Task updated successfully');
};

/**
 * @route   PATCH /api/tasks/:id/status
 * @access  Protected
 */
const updateTaskStatus = async (req, res) => {
  const { status } = req.body;

  const task = await Task.findById(req.params.id);
  if (!task) {
    return errorResponse(res, 'Task not found', 404);
  }

  const allowedNext = VALID_TRANSITIONS[task.status] || [];
  if (!allowedNext.includes(status)) {
    return errorResponse(
      res,
      `Cannot transition task from '${task.status}' to '${status}'`,
      400
    );
  }

  const updateData = { status };
  if (status === 'completed') {
    updateData.completedAt = new Date();
  }

  const previousStatus = task.status;
  await Task.findByIdAndUpdate(req.params.id, updateData, { runValidators: true });

  await ActivityLog.create({
    actor: req.user._id,
    action: 'TASK_STATUS_CHANGED',
    entityType: 'Task',
    entityId: task._id,
    previousValue: { status: previousStatus },
    newValue: { status },
    description: `Task status changed from '${previousStatus}' to '${status}': "${task.title}"`,
    ipAddress: getIpAddress(req),
  });

  // If task is completed, check if all tasks in onboarding are done
  if (status === 'completed') {
    const onboarding = await Onboarding.findById(task.onboarding).populate('tasks');
    if (onboarding) {
      const allTasks = onboarding.tasks;
      const allDone = allTasks.every((t) => String(t._id) === String(task._id) ? true : t.status === 'completed');

      const score = calculateReadinessScore(
        allTasks.map((t) => ({
          ...t.toObject(),
          status: String(t._id) === String(task._id) ? 'completed' : t.status,
        }))
      );

      await Onboarding.findByIdAndUpdate(task.onboarding, { readinessScore: score });

      if (allDone) {
        await Onboarding.findByIdAndUpdate(task.onboarding, {
          status: 'completed',
          actualCompletionDate: new Date(),
        });
        await Employee.findByIdAndUpdate(task.employee, { status: 'completed' });

        // Notify
        const emp = await Employee.findById(task.employee).populate('user');
        if (emp && emp.user) {
          await notifyOnboardingCompleted(onboarding, emp.user._id);
        }
      }
    }
  }

  const updatedTask = await Task.findById(req.params.id)
    .populate('employee', 'name email')
    .populate('assignedOwner', 'name email');

  return successResponse(res, updatedTask, `Task status updated to '${status}'`);
};

/**
 * @route   PATCH /api/tasks/:id/assign
 * @access  Protected - admin, hr_manager, dept_manager
 */
const assignTask = async (req, res) => {
  const { assignedOwner } = req.body;

  const task = await Task.findById(req.params.id);
  if (!task) {
    return errorResponse(res, 'Task not found', 404);
  }

  const previousOwner = task.assignedOwner;

  await Task.findByIdAndUpdate(req.params.id, { assignedOwner });

  const updatedTask = await Task.findById(req.params.id)
    .populate('assignedOwner', 'name email role');

  await notifyTaskAssigned(updatedTask);

  await ActivityLog.create({
    actor: req.user._id,
    action: 'TASK_ASSIGNED',
    entityType: 'Task',
    entityId: task._id,
    previousValue: { assignedOwner: previousOwner },
    newValue: { assignedOwner },
    description: `Task "${task.title}" assigned to new owner`,
    ipAddress: getIpAddress(req),
  });

  return successResponse(res, updatedTask, 'Task assigned successfully');
};

/**
 * @route   PATCH /api/tasks/:id/block
 * @access  Protected
 */
const blockTask = async (req, res) => {
  const { blockerReason } = req.body;

  const task = await Task.findById(req.params.id);
  if (!task) {
    return errorResponse(res, 'Task not found', 404);
  }

  if (task.status === 'completed') {
    return errorResponse(res, 'Cannot block a completed task', 400);
  }

  const updateData = {
    status: 'blocked',
    blockerReason,
    blockedAt: new Date(),
    blockedBy: req.user._id,
  };

  await Task.findByIdAndUpdate(req.params.id, updateData);
  const updatedTask = await Task.findById(req.params.id)
    .populate('assignedOwner', 'name email')
    .populate('blockedBy', 'name email');

  await notifyBlockerCreated(updatedTask, req.user._id);

  await ActivityLog.create({
    actor: req.user._id,
    action: 'TASK_BLOCKED',
    entityType: 'Task',
    entityId: task._id,
    newValue: { status: 'blocked', blockerReason },
    description: `Task blocked: "${task.title}". Reason: ${blockerReason}`,
    ipAddress: getIpAddress(req),
  });

  return successResponse(res, updatedTask, 'Task marked as blocked');
};

/**
 * @route   PATCH /api/tasks/:id/unblock
 * @access  Protected
 */
const unblockTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return errorResponse(res, 'Task not found', 404);
  }

  if (task.status !== 'blocked') {
    return errorResponse(res, 'Task is not currently blocked', 400);
  }

  const updateData = {
    status: 'in_progress',
    resolvedAt: new Date(),
    blockerReason: null,
  };

  await Task.findByIdAndUpdate(req.params.id, updateData);
  const updatedTask = await Task.findById(req.params.id)
    .populate('assignedOwner', 'name email');

  await notifyBlockerResolved(updatedTask);

  await ActivityLog.create({
    actor: req.user._id,
    action: 'TASK_UNBLOCKED',
    entityType: 'Task',
    entityId: task._id,
    previousValue: { status: 'blocked', blockerReason: task.blockerReason },
    newValue: { status: 'in_progress', resolvedAt: updateData.resolvedAt },
    description: `Task unblocked: "${task.title}"`,
    ipAddress: getIpAddress(req),
  });

  return successResponse(res, updatedTask, 'Task unblocked — marked as in progress');
};

/**
 * @route   DELETE /api/tasks/:id
 * @access  Protected - admin, hr_manager
 */
const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return errorResponse(res, 'Task not found', 404);
  }

  // Remove from onboarding
  await Onboarding.findByIdAndUpdate(task.onboarding, { $pull: { tasks: task._id } });

  await Task.findByIdAndDelete(req.params.id);

  await ActivityLog.create({
    actor: req.user._id,
    action: 'TASK_DELETED',
    entityType: 'Task',
    entityId: task._id,
    description: `Task deleted: "${task.title}"`,
    ipAddress: getIpAddress(req),
  });

  return successResponse(res, null, 'Task deleted successfully');
};

module.exports = {
  getTasks,
  createTask,
  getTask,
  updateTask,
  updateTaskStatus,
  assignTask,
  blockTask,
  unblockTask,
  deleteTask,
};
