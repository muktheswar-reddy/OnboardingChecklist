'use strict';

const Employee = require('../models/Employee');
const User = require('../models/User');
const Onboarding = require('../models/Onboarding');
const Template = require('../models/Template');
const ActivityLog = require('../models/ActivityLog');
const { generateChecklistFromTemplate } = require('../services/checklistService');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { paginate, getIpAddress } = require('../utils/helpers');

/**
 * @route   GET /api/employees
 * @access  Protected - admin, hr_manager, dept_manager
 */
const getEmployees = async (req, res) => {
  const { page = 1, limit = 10, department, status, search, sort = '-createdAt' } = req.query;
  const { skip, limit: lim, page: pg } = paginate(null, page, limit);

  const filter = {};
  if (department) filter.department = department;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { employeeId: { $regex: search, $options: 'i' } },
      { jobTitle: { $regex: search, $options: 'i' } },
    ];
  }

  const [employees, total] = await Promise.all([
    Employee.find(filter)
      .populate('department', 'name')
      .populate('manager', 'name email')
      .populate('user', 'name email role lastLogin')
      .sort(sort)
      .skip(skip)
      .limit(lim),
    Employee.countDocuments(filter),
  ]);

  return paginatedResponse(res, employees, total, pg, lim, 'Employees retrieved');
};

/**
 * @route   POST /api/employees
 * @access  Protected - admin, hr_manager
 */
const createEmployee = async (req, res) => {
  const { name, email, jobTitle, department, joiningDate, manager, phone, password, templateId } = req.body;

  // Check for duplicate employee email
  const existingEmp = await Employee.findOne({ email: email.toLowerCase() });
  if (existingEmp) {
    return errorResponse(res, 'An employee with this email already exists', 409);
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return errorResponse(res, 'A user account with this email already exists', 409);
  }

  // Create user account for employee
  const userAccount = await User.create({
    name,
    email,
    passwordHash: password || `Temp@${Math.random().toString(36).slice(2, 8)}123`,
    role: 'employee',
    department,
  });

  // Create the employee record
  const employee = await Employee.create({
    name,
    email,
    jobTitle,
    department,
    joiningDate: joiningDate || new Date(),
    manager: manager || null,
    user: userAccount._id,
    phone: phone || null,
  });

  // Find the default template (or specific template)
  let template = templateId
    ? await Template.findById(templateId)
    : await Template.findOne({ isDefault: true });

  let onboarding = null;
  if (template) {
    onboarding = await Onboarding.create({
      employee: employee._id,
      template: template._id,
      startDate: employee.joiningDate,
      expectedCompletionDate: new Date(
        new Date(employee.joiningDate).getTime() + template.estimatedDuration * 24 * 60 * 60 * 1000
      ),
      status: 'not_started',
      createdBy: req.user._id,
    });

    // Generate tasks from template
    await generateChecklistFromTemplate(
      onboarding._id,
      template,
      employee._id,
      employee.joiningDate,
      department
    );

    // Update onboarding status
    await Onboarding.findByIdAndUpdate(onboarding._id, { status: 'in_progress' });

    // Link onboarding to employee
    await Employee.findByIdAndUpdate(employee._id, {
      onboarding: onboarding._id,
      status: 'onboarding',
    });
  }

  await ActivityLog.create({
    actor: req.user._id,
    action: 'EMPLOYEE_CREATED',
    entityType: 'Employee',
    entityId: employee._id,
    newValue: { name, email, jobTitle, department },
    description: `Employee created: ${name} (${employee.employeeId})`,
    ipAddress: getIpAddress(req),
  });

  const populatedEmployee = await Employee.findById(employee._id)
    .populate('department', 'name')
    .populate('manager', 'name email')
    .populate('user', 'name email role');

  return successResponse(
    res,
    { employee: populatedEmployee, onboarding },
    'Employee created successfully',
    201
  );
};

/**
 * @route   GET /api/employees/:id
 * @access  Protected
 */
const getEmployee = async (req, res) => {
  const employee = await Employee.findById(req.params.id)
    .populate('department', 'name description')
    .populate('manager', 'name email role')
    .populate('user', 'name email role lastLogin isActive')
    .populate({
      path: 'onboarding',
      populate: {
        path: 'tasks',
        select: 'title status priority dueDate category completedAt',
      },
    });

  if (!employee) {
    return errorResponse(res, 'Employee not found', 404);
  }

  return successResponse(res, employee, 'Employee retrieved');
};

/**
 * @route   PUT /api/employees/:id
 * @access  Protected - admin, hr_manager
 */
const updateEmployee = async (req, res) => {
  const allowedFields = ['name', 'email', 'jobTitle', 'department', 'manager', 'phone', 'status', 'avatar'];
  const updateData = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const existing = await Employee.findById(req.params.id);
  if (!existing) {
    return errorResponse(res, 'Employee not found', 404);
  }

  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  )
    .populate('department', 'name')
    .populate('manager', 'name email')
    .populate('user', 'name email role');

  await ActivityLog.create({
    actor: req.user._id,
    action: 'EMPLOYEE_UPDATED',
    entityType: 'Employee',
    entityId: employee._id,
    previousValue: existing.toObject(),
    newValue: updateData,
    description: `Employee updated: ${employee.name}`,
    ipAddress: getIpAddress(req),
  });

  return successResponse(res, employee, 'Employee updated successfully');
};

/**
 * @route   DELETE /api/employees/:id
 * @access  Protected - admin
 */
const deleteEmployee = async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    return errorResponse(res, 'Employee not found', 404);
  }

  // Soft delete - deactivate
  await Employee.findByIdAndUpdate(req.params.id, { status: 'inactive' });

  // Deactivate associated user
  if (employee.user) {
    await User.findByIdAndUpdate(employee.user, { isActive: false });
  }

  await ActivityLog.create({
    actor: req.user._id,
    action: 'EMPLOYEE_DELETED',
    entityType: 'Employee',
    entityId: employee._id,
    previousValue: { status: employee.status },
    newValue: { status: 'inactive' },
    description: `Employee soft-deleted: ${employee.name} (${employee.employeeId})`,
    ipAddress: getIpAddress(req),
  });

  return successResponse(res, null, 'Employee deactivated successfully');
};

module.exports = { getEmployees, createEmployee, getEmployee, updateEmployee, deleteEmployee };
