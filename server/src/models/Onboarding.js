'use strict';

const mongoose = require('mongoose');

const onboardingSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Employee is required'],
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
      default: null,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      default: Date.now,
    },
    expectedCompletionDate: {
      type: Date,
      default: null,
    },
    actualCompletionDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['not_started', 'in_progress', 'completed', 'delayed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'not_started',
    },
    readinessScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
onboardingSchema.index({ employee: 1 });
onboardingSchema.index({ status: 1 });
onboardingSchema.index({ startDate: -1 });
onboardingSchema.index({ expectedCompletionDate: 1 });

// Virtual: progressPercentage
onboardingSchema.virtual('progressPercentage').get(function () {
  if (!this.tasks || this.tasks.length === 0) return 0;

  // If tasks are not populated, return readinessScore
  const populatedTasks = this.tasks.filter((t) => t && typeof t === 'object' && t.status);
  if (populatedTasks.length === 0) return this.readinessScore || 0;

  const completed = populatedTasks.filter((t) => t.status === 'completed').length;
  return Math.round((completed / populatedTasks.length) * 100);
});

// Method: calculateReadinessScore
onboardingSchema.methods.calculateReadinessScore = function (tasks) {
  if (!tasks || tasks.length === 0) {
    this.readinessScore = 0;
    return 0;
  }

  const weights = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  let totalWeight = 0;
  let completedWeight = 0;

  tasks.forEach((task) => {
    const w = weights[task.priority] || 1;
    totalWeight += w;
    if (task.status === 'completed') {
      completedWeight += w;
    }
  });

  const score = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
  this.readinessScore = score;
  return score;
};

const Onboarding = mongoose.model('Onboarding', onboardingSchema);

module.exports = Onboarding;
