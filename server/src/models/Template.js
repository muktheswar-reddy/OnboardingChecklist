'use strict';

const mongoose = require('mongoose');

const taskDefinitionSchema = new mongoose.Schema(
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
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    category: {
      type: String,
      enum: {
        values: ['IT', 'HR', 'Training', 'Workplace'],
        message: '{VALUE} is not a valid category',
      },
      required: [true, 'Category is required'],
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'critical'],
        message: '{VALUE} is not a valid priority',
      },
      default: 'medium',
    },
    dueOffsetDays: {
      type: Number,
      required: [true, 'Due offset days is required'],
      min: [0, 'Due offset days cannot be negative'],
      default: 7,
    },
    assignTo: {
      type: String,
      trim: true,
      default: 'hr_manager',
    },
  },
  { _id: true }
);

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Template name is required'],
      trim: true,
      maxlength: [200, 'Template name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    department: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    jobRole: {
      type: String,
      trim: true,
      default: 'General',
    },
    taskDefinitions: {
      type: [taskDefinitionSchema],
      default: [],
    },
    estimatedDuration: {
      type: Number,
      min: [1, 'Estimated duration must be at least 1 day'],
      default: 30,
    },
    isDefault: {
      type: Boolean,
      default: false,
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

templateSchema.index({ name: 1 });
templateSchema.index({ department: 1 });
templateSchema.index({ isDefault: 1 });
templateSchema.index({ jobRole: 1 });

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
