'use strict';

const mongoose = require('mongoose');
const { generateEmployeeId } = require('../utils/helpers');

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Job title cannot exceed 100 characters'],
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
    },
    joiningDate: {
      type: Date,
      required: [true, 'Joining date is required'],
      default: Date.now,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    onboarding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Onboarding',
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive', 'onboarding', 'completed'],
        message: '{VALUE} is not a valid status',
      },
      default: 'onboarding',
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[\+]?[0-9\s\-\(\)]{7,20}$/, 'Please provide a valid phone number'],
      default: null,
    },
    avatar: {
      type: String,
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
employeeSchema.index({ department: 1 });
employeeSchema.index({ status: 1 });
employeeSchema.index({ manager: 1 });
employeeSchema.index({ joiningDate: -1 });

// Pre-save: auto-generate employeeId
employeeSchema.pre('save', async function (next) {
  if (!this.isNew || this.employeeId) return next();

  let isUnique = false;
  let newId;

  while (!isUnique) {
    newId = generateEmployeeId();
    const existing = await mongoose.model('Employee').findOne({ employeeId: newId });
    if (!existing) isUnique = true;
  }

  this.employeeId = newId;
  next();
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
