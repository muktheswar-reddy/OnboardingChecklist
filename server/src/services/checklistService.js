'use strict';

const Task = require('../models/Task');
const Onboarding = require('../models/Onboarding');
const { addDays } = require('../utils/helpers');

/**
 * Generate checklist tasks from a template for a given onboarding
 * @param {string} onboardingId
 * @param {object} template - Template document
 * @param {string} employeeId - Employee ObjectId
 * @param {Date} startDate
 * @param {string|null} departmentId
 * @returns {Promise<Task[]>} Created task documents
 */
const generateChecklistFromTemplate = async (
  onboardingId,
  template,
  employeeId,
  startDate,
  departmentId = null
) => {
  if (!template || !template.taskDefinitions || template.taskDefinitions.length === 0) {
    return [];
  }

  const start = startDate ? new Date(startDate) : new Date();
  const taskDocs = [];

  for (const taskDef of template.taskDefinitions) {
    const dueDate = addDays(start, taskDef.dueOffsetDays || 7);

    const task = new Task({
      title: taskDef.title,
      description: taskDef.description || '',
      onboarding: onboardingId,
      employee: employeeId,
      assignedOwner: null, // Will be assigned later or by role resolution
      department: departmentId,
      category: taskDef.category || 'Other',
      priority: taskDef.priority || 'medium',
      status: 'not_started',
      dueDate,
    });

    await task.save();
    taskDocs.push(task);
  }

  // Link tasks to the onboarding
  await Onboarding.findByIdAndUpdate(onboardingId, {
    $push: { tasks: { $each: taskDocs.map((t) => t._id) } },
  });

  return taskDocs;
};

module.exports = { generateChecklistFromTemplate };
