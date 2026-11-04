'use strict';

const Notification = require('../models/Notification');

/**
 * Create a notification record
 */
const createNotification = async (recipientId, type, title, message, entityType = null, entityId = null) => {
  if (!recipientId) return null;

  try {
    const notification = await Notification.create({
      recipient: recipientId,
      type,
      title,
      message,
      entityType,
      entityId,
    });
    return notification;
  } catch (err) {
    console.error('Failed to create notification:', err.message);
    return null;
  }
};

/**
 * Notify assigned owner when a task is assigned
 */
const notifyTaskAssigned = async (task) => {
  if (!task.assignedOwner) return;

  return createNotification(
    task.assignedOwner,
    'task_assigned',
    'New Task Assigned',
    `You have been assigned a new task: "${task.title}"`,
    'Task',
    task._id
  );
};

/**
 * Notify about an approaching deadline
 */
const notifyDeadlineApproaching = async (task) => {
  if (!task.assignedOwner) return;

  const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'soon';

  return createNotification(
    task.assignedOwner,
    'deadline_approaching',
    'Task Deadline Approaching',
    `Task "${task.title}" is due on ${dueDate}. Please ensure timely completion.`,
    'Task',
    task._id
  );
};

/**
 * Notify about an overdue task
 */
const notifyTaskOverdue = async (task) => {
  if (!task.assignedOwner) return;

  return createNotification(
    task.assignedOwner,
    'task_overdue',
    'Task Overdue',
    `Task "${task.title}" is overdue. Please take immediate action.`,
    'Task',
    task._id
  );
};

/**
 * Notify when a blocker is created
 */
const notifyBlockerCreated = async (task, reportedBy) => {
  const recipients = new Set();

  if (task.assignedOwner) recipients.add(String(task.assignedOwner));
  if (reportedBy) recipients.add(String(reportedBy));

  const notifications = [];
  for (const recipientId of recipients) {
    const n = await createNotification(
      recipientId,
      'blocker_created',
      'Task Blocked',
      `Task "${task.title}" has been marked as blocked. Reason: ${task.blockerReason || 'Not specified'}`,
      'Task',
      task._id
    );
    if (n) notifications.push(n);
  }

  return notifications;
};

/**
 * Notify when a blocker is resolved
 */
const notifyBlockerResolved = async (task) => {
  if (!task.assignedOwner) return;

  return createNotification(
    task.assignedOwner,
    'blocker_resolved',
    'Task Blocker Resolved',
    `The blocker on task "${task.title}" has been resolved. You can now proceed.`,
    'Task',
    task._id
  );
};

/**
 * Notify when an onboarding is completed
 */
const notifyOnboardingCompleted = async (onboarding, recipientId) => {
  if (!recipientId) return;

  return createNotification(
    recipientId,
    'onboarding_completed',
    'Onboarding Completed 🎉',
    `Onboarding process has been completed successfully!`,
    'Onboarding',
    onboarding._id
  );
};

module.exports = {
  createNotification,
  notifyTaskAssigned,
  notifyDeadlineApproaching,
  notifyTaskOverdue,
  notifyBlockerCreated,
  notifyBlockerResolved,
  notifyOnboardingCompleted,
};
