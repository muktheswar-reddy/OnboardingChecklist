'use strict';

const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    path: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    onboarding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Onboarding',
      required: [true, 'Onboarding reference is required'],
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee reference is required'],
    },
    assignedOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    category: {
      type: String,
      enum: {
        values: ['IT', 'HR', 'Training', 'Workplace', 'Other'],
        message: '{VALUE} is not a valid category',
      },
      default: 'Other',
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'critical'],
        message: '{VALUE} is not a valid priority',
      },
      default: 'medium',
    },
    status: {
      type: String,
      enum: {
        values: ['not_started', 'in_progress', 'completed', 'blocked', 'overdue'],
        message: '{VALUE} is not a valid status',
      },
      default: 'not_started',
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    completedAt: {
      type: Date,
      default: null,
    },
    blockerReason: {
      type: String,
      trim: true,
      maxlength: [1000, 'Blocker reason cannot exceed 1000 characters'],
      default: null,
    },
    blockedAt: {
      type: Date,
      default: null,
    },
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
taskSchema.index({ onboarding: 1 });
taskSchema.index({ employee: 1 });
taskSchema.index({ assignedOwner: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ category: 1 });
taskSchema.index({ department: 1 });

// Virtual: isOverdue
taskSchema.virtual('isOverdue').get(function () {
  if (this.status === 'completed') return false;
  return this.dueDate && this.dueDate < new Date();
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
