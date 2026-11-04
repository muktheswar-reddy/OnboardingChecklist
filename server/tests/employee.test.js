'use strict';

const request = require('supertest');
const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/database');
const User = require('../src/models/User');
const Department = require('../src/models/Department');
const Employee = require('../src/models/Employee');

describe('Employee API Endpoints', () => {
  let adminToken;
  let dept;

  beforeAll(async () => {
    await connectDB();

    dept = await Department.findOne({ name: 'Engineering' });
    if (!dept) {
      dept = await Department.create({ name: 'Engineering', description: 'Tech dept' });
    }

    let admin = await User.findOne({ email: 'admin@onboardingchecklist.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin Test',
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
  });

  afterAll(async () => {
    await Employee.deleteMany({ email: 'test.emp@example.com' });
    await disconnectDB();
  });

  it('GET /api/employees should list employees', async () => {
    const res = await request(app)
      .get('/api/employees')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.employees || res.body.data)).toBe(true);
  });

  it('POST /api/employees should create employee with auto employeeId', async () => {
    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Employee Candidate',
        email: 'test.emp@example.com',
        jobTitle: 'Junior Developer',
        department: dept._id,
        joiningDate: new Date().toISOString()
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.employee.employeeId).toBeDefined();
    expect(res.body.data.employee.name).toBe('Test Employee Candidate');
  });

  it('GET /api/employees/:id should return 404 for non-existent ID', async () => {
    const res = await request(app)
      .get('/api/employees/64b1f2e3d4c5b6a7b8c9d0e1')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });
});

