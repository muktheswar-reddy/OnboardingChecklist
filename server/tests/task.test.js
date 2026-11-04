'use strict';

const request = require('supertest');
const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/database');
const User = require('../src/models/User');
const Department = require('../src/models/Department');
const Employee = require('../src/models/Employee');
const Onboarding = require('../src/models/Onboarding');
const Task = require('../src/models/Task');

describe('Task API Endpoints', () => {
  let adminToken;
  let sampleTask;

  beforeAll(async () => {
    await connectDB();

    let admin = await User.findOne({ email: 'admin@onboardingchecklist.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin Task Test',
        email: 'admin@onboardingchecklist.com',
        passwordHash: 'Admin@123',
        role: 'admin',
        isActive: true
      });
    }

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@onboardingchecklist.com', password: 'Admin@123' });
    adminToken = loginRes.body.data.token;

    let dept = await Department.findOne();
    if (!dept) {
      dept = await Department.create({ name: 'Engineering', description: 'Tech' });
    }

    let emp = await Employee.findOne();
    if (!emp) {
      emp = await Employee.create({
        employeeId: 'EMP-9999',
        name: 'Task Test Employee',
        email: 'task.emp@example.com',
        jobTitle: 'Developer',
        department: dept._id
      });
    }

    let ob = await Onboarding.findOne();
    if (!ob) {
      ob = await Onboarding.create({
        employee: emp._id,
        startDate: new Date(),
        status: 'in_progress',
        readinessScore: 50
      });
    }

    sampleTask = await Task.findOne();
    if (!sampleTask) {
      sampleTask = await Task.create({
        title: 'Initial Test Task',
        description: 'Test Description',
        onboarding: ob._id,
        employee: emp._id,
        department: dept._id,
        category: 'IT',
        priority: 'high',
        status: 'in_progress',
        dueDate: new Date(Date.now() + 86400000)
      });
    }
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it('GET /api/tasks should retrieve task list', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('PATCH /api/tasks/:id/block should flag task as blocked with mandatory reason', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${sampleTask._id}/block`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ blockerReason: 'Waiting for hardware delivery from warehouse' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('blocked');
    expect(res.body.data.blockerReason).toBe('Waiting for hardware delivery from warehouse');
  });

  it('PATCH /api/tasks/:id/unblock should resolve the blocker', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${sampleTask._id}/unblock`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).not.toBe('blocked');
    expect(res.body.data.blockerReason).toBeNull();
  });

  it('PATCH /api/tasks/:id/status should update status to completed', async () => {
    const res = await request(app)
      .patch(`/api/tasks/${sampleTask._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'completed' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('completed');
  });
});
