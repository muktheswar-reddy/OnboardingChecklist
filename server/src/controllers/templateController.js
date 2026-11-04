'use strict';

const Template = require('../models/Template');
const ActivityLog = require('../models/ActivityLog');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/apiResponse');
const { paginate, getIpAddress } = require('../utils/helpers');

/**
 * @route   GET /api/templates
 * @access  Protected
 */
const getTemplates = async (req, res) => {
  const { page = 1, limit = 10, department, jobRole, isDefault, search, sort = '-createdAt' } = req.query;
  const { skip, limit: lim, page: pg } = paginate(null, page, limit);

  const filter = {};
  if (department) filter.department = department;
  if (jobRole) filter.jobRole = { $regex: jobRole, $options: 'i' };
  if (isDefault === 'true') filter.isDefault = true;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { jobRole: { $regex: search, $options: 'i' } },
    ];
  }

  const [templates, total] = await Promise.all([
    Template.find(filter)
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(lim),
    Template.countDocuments(filter),
  ]);

  return paginatedResponse(res, templates, total, pg, lim, 'Templates retrieved');
};

/**
 * @route   POST /api/templates
 * @access  Protected - admin, hr_manager
 */
const createTemplate = async (req, res) => {
  const { name, description, department, jobRole, taskDefinitions, estimatedDuration, isDefault } = req.body;

  const existing = await Template.findOne({ name });
  if (existing) {
    return errorResponse(res, 'A template with this name already exists', 409);
  }

  // If this is set as default, unset previous defaults
  if (isDefault) {
    await Template.updateMany({ isDefault: true }, { $set: { isDefault: false } });
  }

  const template = await Template.create({
    name,
    description: description || '',
    department: department || null,
    jobRole: jobRole || 'General',
    taskDefinitions: taskDefinitions || [],
    estimatedDuration: estimatedDuration || 30,
    isDefault: isDefault || false,
    createdBy: req.user._id,
  });

  await ActivityLog.create({
    actor: req.user._id,
    action: 'TEMPLATE_CREATED',
    entityType: 'Template',
    entityId: template._id,
    description: `Template created: "${name}"`,
    ipAddress: getIpAddress(req),
  });

  const populated = await Template.findById(template._id).populate('createdBy', 'name email');
  return successResponse(res, populated, 'Template created successfully', 201);
};

/**
 * @route   GET /api/templates/:id
 * @access  Protected
 */
const getTemplate = async (req, res) => {
  const template = await Template.findById(req.params.id).populate('createdBy', 'name email');
  if (!template) {
    return errorResponse(res, 'Template not found', 404);
  }
  return successResponse(res, template, 'Template retrieved');
};

/**
 * @route   PUT /api/templates/:id
 * @access  Protected - admin, hr_manager
 */
const updateTemplate = async (req, res) => {
  const allowedFields = ['name', 'description', 'department', 'jobRole', 'taskDefinitions', 'estimatedDuration', 'isDefault'];
  const updateData = {};
  allowedFields.forEach((f) => {
    if (req.body[f] !== undefined) updateData[f] = req.body[f];
  });

  const existing = await Template.findById(req.params.id);
  if (!existing) {
    return errorResponse(res, 'Template not found', 404);
  }

  // If setting as default, clear others
  if (updateData.isDefault === true) {
    await Template.updateMany(
      { _id: { $ne: req.params.id }, isDefault: true },
      { $set: { isDefault: false } }
    );
  }

  const template = await Template.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate('createdBy', 'name email');

  await ActivityLog.create({
    actor: req.user._id,
    action: 'TEMPLATE_UPDATED',
    entityType: 'Template',
    entityId: template._id,
    previousValue: existing.toObject(),
    newValue: updateData,
    description: `Template updated: "${template.name}"`,
    ipAddress: getIpAddress(req),
  });

  return successResponse(res, template, 'Template updated successfully');
};

/**
 * @route   DELETE /api/templates/:id
 * @access  Protected - admin
 */
const deleteTemplate = async (req, res) => {
  const template = await Template.findById(req.params.id);
  if (!template) {
    return errorResponse(res, 'Template not found', 404);
  }

  if (template.isDefault) {
    return errorResponse(res, 'Cannot delete the default template', 400);
  }

  await Template.findByIdAndDelete(req.params.id);

  await ActivityLog.create({
    actor: req.user._id,
    action: 'TEMPLATE_DELETED',
    entityType: 'Template',
    entityId: template._id,
    description: `Template deleted: "${template.name}"`,
    ipAddress: getIpAddress(req),
  });

  return successResponse(res, null, 'Template deleted successfully');
};

module.exports = { getTemplates, createTemplate, getTemplate, updateTemplate, deleteTemplate };
