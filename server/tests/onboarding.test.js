'use strict';

const request = require('supertest');
const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/database');
const User = require('../src/models/User');
const Department = require('../src/models/Department');
const Employee = require('../src/models/Employee');
const Onboarding = require('../src/models/Onboarding');

describe('Onboarding & Analytics API Endpoints', () => {
  let adminToken;

  beforeAll(async () => {
    await connectDB();

    let admin = await User.findOne({ email: 'admin@onboardingchecklist.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin Onboard Test',
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
      dept = await Department.create({ name: 'Human Resources', description: 'People' });
    }

    let emp = await Employee.findOne();
    if (!emp) {
      emp = await Employee.create({
        employeeId: 'EMP-7777',
        name: 'Onboard Test Emp',
        email: 'onboard.emp@example.com',
        jobTitle: 'Coordinator',
        department: dept._id
      });
    }

    let ob = await Onboarding.findOne();
    if (!ob) {
      await Onboarding.create({
        employee: emp._id,
        startDate: new Date(),
        status: 'in_progress',
        readinessScore: 60
      });
    }
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it('GET /api/onboarding should list all onboardings', async () => {
    const res = await request(app)
      .get('/api/onboarding')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/analytics/overview should return metrics and readiness indicators', async () => {
    const res = await request(app)
      .get('/api/analytics/overview')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });

  it('GET /api/analytics/departments should return department-level stats', async () => {
    const res = await request(app)
      .get('/api/analytics/departments')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
