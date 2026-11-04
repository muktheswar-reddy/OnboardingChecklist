'use strict';

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../src/config/database');

const User = require('../src/models/User');
const Department = require('../src/models/Department');
const Employee = require('../src/models/Employee');
const Template = require('../src/models/Template');
const Onboarding = require('../src/models/Onboarding');
const Task = require('../src/models/Task');
const Notification = require('../src/models/Notification');
const ActivityLog = require('../src/models/ActivityLog');

const seedData = async () => {
  try {
    await connectDB();
    console.log('🧹 Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Department.deleteMany({}),
      Employee.deleteMany({}),
      Template.deleteMany({}),
      Onboarding.deleteMany({}),
      Task.deleteMany({}),
      Notification.deleteMany({}),
      ActivityLog.deleteMany({})
    ]);

    console.log('🏢 Creating Departments...');
    const departments = await Department.create([
      { name: 'Engineering', description: 'Core software development, devops, and platform engineering' },
      { name: 'Human Resources', description: 'People operations, recruiting, onboarding, and payroll' },
      { name: 'Product', description: 'Product strategy, discovery, design, and roadmap' },
      { name: 'Marketing', description: 'Growth, brand marketing, content, and events' },
      { name: 'Design', description: 'UI/UX design, visual branding, and design system' }
    ]);
    const deptMap = {};
    departments.forEach(d => { deptMap[d.name] = d._id; });

    console.log('👥 Creating Users (Admin, HR, Dept Managers, IT Team)...');
    const defaultPassword = 'Admin@123';

    // 1 Admin
    const admin = await User.create({
      name: 'Suram Muktheswar Reddy (Admin)',
      email: 'admin@onboardingchecklist.com',
      passwordHash: defaultPassword,
      role: 'admin',
      department: deptMap['Engineering'],
      isActive: true
    });

    // 2 HR Managers
    const hrManagers = await User.create([
      {
        name: 'Sarah Jenkins',
        email: 'sarah.jenkins@onboardingchecklist.com',
        passwordHash: defaultPassword,
        role: 'hr_manager',
        department: deptMap['Human Resources'],
        isActive: true
      },
      {
        name: 'Rachel Adams',
        email: 'rachel.adams@onboardingchecklist.com',
        passwordHash: defaultPassword,
        role: 'hr_manager',
        department: deptMap['Human Resources'],
        isActive: true
      }
    ]);

    // 3 Department Managers
    const deptManagers = await User.create([
      {
        name: 'David Kim',
        email: 'david.kim@onboardingchecklist.com',
        passwordHash: defaultPassword,
        role: 'dept_manager',
        department: deptMap['Engineering'],
        isActive: true
      },
      {
        name: 'Elena Rostova',
        email: 'elena.rostova@onboardingchecklist.com',
        passwordHash: defaultPassword,
        role: 'dept_manager',
        department: deptMap['Product'],
        isActive: true
      },
      {
        name: 'Michael Chen',
        email: 'michael.chen@onboardingchecklist.com',
        passwordHash: defaultPassword,
        role: 'dept_manager',
        department: deptMap['Design'],
        isActive: true
      }
    ]);

    // 3 IT Team members
    const itTeam = await User.create([
      {
        name: 'Marcus Vance',
        email: 'marcus.vance@onboardingchecklist.com',
        passwordHash: defaultPassword,
        role: 'it_team',
        department: deptMap['Engineering'],
        isActive: true
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@onboardingchecklist.com',
        passwordHash: defaultPassword,
        role: 'it_team',
        department: deptMap['Engineering'],
        isActive: true
      },
      {
        name: 'Kevin O\'Connor',
        email: 'kevin.oconnor@onboardingchecklist.com',
        passwordHash: defaultPassword,
        role: 'it_team',
        department: deptMap['Engineering'],
        isActive: true
      }
    ]);

    console.log('📋 Creating Onboarding Templates...');
    const engineeringTemplate = await Template.create({
      name: 'Engineering Onboarding Standard',
      description: 'Comprehensive 30-day checklist for Software, Frontend, and Backend Engineers',
      department: deptMap['Engineering'],
      jobRole: 'Software Engineer',
      estimatedDuration: 30,
      isDefault: true,
      taskDefinitions: [
        { title: 'Provision MacBook Pro M3 & YubiKey', description: 'Configure hardware, enroll in MDM, ship or hand over hardware.', category: 'IT', priority: 'critical', dueOffsetDays: 1, assignTo: 'it_team' },
        { title: 'Create Google Workspace & Slack Account', description: 'Generate corporate credentials and assign to department distribution lists.', category: 'IT', priority: 'critical', dueOffsetDays: 1, assignTo: 'it_team' },
        { title: 'Configure Company VPN & Okta SSO', description: 'Enable MFA, generate WireGuard VPN certificates and grant base network access.', category: 'IT', priority: 'high', dueOffsetDays: 2, assignTo: 'it_team' },
        { title: 'Sign Employment Agreement & Tax Form W-4', description: 'Collect and verify signed joining documents and identity documentation.', category: 'HR', priority: 'critical', dueOffsetDays: 2, assignTo: 'hr_manager' },
        { title: 'Benefits Enrollment & Insurance Review', description: 'Walk through health insurance, 401(k) matching, and PTO policy.', category: 'HR', priority: 'medium', dueOffsetDays: 5, assignTo: 'hr_manager' },
        { title: 'Manager 1:1 & First-Week Objectives', description: 'Define key learning outcomes, sprint cadence, and team expectations.', category: 'Workplace', priority: 'high', dueOffsetDays: 2, assignTo: 'dept_manager' },
        { title: 'Assign Onboarding Buddy / Senior Mentor', description: 'Pair new hire with an experienced engineer for daily pairing and code reviews.', category: 'Workplace', priority: 'medium', dueOffsetDays: 2, assignTo: 'dept_manager' },
        { title: 'Local Development Environment Setup', description: 'Clone monorepo, configure Docker, Node.js, secrets, and run local test suite.', category: 'Training', priority: 'high', dueOffsetDays: 3, assignTo: 'employee' },
        { title: 'Submit First "Good First Issue" Pull Request', description: 'Ship a small bug fix or documentation update to verify CI/CD deployment flow.', category: 'Training', priority: 'high', dueOffsetDays: 7, assignTo: 'employee' },
        { title: 'Security & Compliance Awareness Training', description: 'Complete SOC2, HIPAA, and Data Privacy video training modules.', category: 'Training', priority: 'medium', dueOffsetDays: 10, assignTo: 'hr_manager' }
      ]
    });

    const generalTemplate = await Template.create({
      name: 'General Business & Operations Onboarding',
      description: 'Standard checklist for HR, Product, Marketing and Operations team members',
      department: deptMap['Human Resources'],
      jobRole: 'General Role',
      estimatedDuration: 30,
      isDefault: false,
      taskDefinitions: [
        { title: 'Issue Corporate Laptop & Peripherals', description: 'Set up hardware and enroll in device management.', category: 'IT', priority: 'high', dueOffsetDays: 1, assignTo: 'it_team' },
        { title: 'Set Up Email, Calendar & Slack', description: 'Provision core workplace communication accounts.', category: 'IT', priority: 'critical', dueOffsetDays: 1, assignTo: 'it_team' },
        { title: 'Sign Confidentiality & Joining Paperwork', description: 'Complete digital HR documentation.', category: 'HR', priority: 'critical', dueOffsetDays: 2, assignTo: 'hr_manager' },
        { title: 'Welcome Orientation & Company Culture Presentation', description: 'Overview of company vision, core values, and executive leadership.', category: 'Workplace', priority: 'medium', dueOffsetDays: 3, assignTo: 'hr_manager' },
        { title: 'Department Systems & SaaS Tools Walkthrough', description: 'Grant access to Notion, Figma, Jira, and Hubspot as required.', category: 'Training', priority: 'high', dueOffsetDays: 4, assignTo: 'dept_manager' },
        { title: 'Review 30-60-90 Day Success Goals', description: 'Set qualitative expectations and milestones for first quarter.', category: 'Workplace', priority: 'high', dueOffsetDays: 7, assignTo: 'dept_manager' }
      ]
    });

    console.log('👤 Creating 10 Sample Employees & Users...');
    const employeeData = [
      { name: 'Alexander Wright', email: 'alex.wright@onboardingchecklist.com', role: 'Software Engineer', dept: 'Engineering', manager: deptManagers[0] },
      { name: 'Sophia Martinez', email: 'sophia.martinez@onboardingchecklist.com', role: 'Frontend Developer', dept: 'Engineering', manager: deptManagers[0] },
      { name: 'Liam O\'Sullivan', email: 'liam.osullivan@onboardingchecklist.com', role: 'Backend Developer', dept: 'Engineering', manager: deptManagers[0] },
      { name: 'Chloe Dubois', email: 'chloe.dubois@onboardingchecklist.com', role: 'UI/UX Designer', dept: 'Design', manager: deptManagers[2] },
      { name: 'Ethan Patel', email: 'ethan.patel@onboardingchecklist.com', role: 'Product Manager', dept: 'Product', manager: deptManagers[1] },
      { name: 'Emma Watson', email: 'emma.watson@onboardingchecklist.com', role: 'Data Analyst', dept: 'Engineering', manager: deptManagers[0] },
      { name: 'Noah Fischer', email: 'noah.fischer@onboardingchecklist.com', role: 'Marketing Executive', dept: 'Marketing', manager: deptManagers[1] },
      { name: 'Olivia Taylor', email: 'olivia.taylor@onboardingchecklist.com', role: 'HR Executive', dept: 'Human Resources', manager: hrManagers[0] },
      { name: 'Lucas Rossi', email: 'lucas.rossi@onboardingchecklist.com', role: 'Software Engineer', dept: 'Engineering', manager: deptManagers[0] },
      { name: 'Mia Tanaka', email: 'mia.tanaka@onboardingchecklist.com', role: 'Frontend Developer', dept: 'Engineering', manager: deptManagers[0] }
    ];

    let totalTasksCreated = 0;

    for (let i = 0; i < employeeData.length; i++) {
      const data = employeeData[i];
      const deptId = deptMap[data.dept];

      // Create employee user account
      const empUser = await User.create({
        name: data.name,
        email: data.email,
        passwordHash: defaultPassword,
        role: 'employee',
        department: deptId,
        isActive: true
      });

      // Joining date calculation (spread across past 25 days)
      const daysAgo = (i % 4) * 6;
      const joinDate = new Date();
      joinDate.setDate(joinDate.getDate() - daysAgo);

      const expDate = new Date(joinDate);
      expDate.setDate(expDate.getDate() + 30);

      const employee = await Employee.create({
        employeeId: `EMP-${1000 + i + 1}`,
        name: data.name,
        email: data.email,
        jobTitle: data.role,
        department: deptId,
        joiningDate: joinDate,
        manager: data.manager._id,
        user: empUser._id,
        status: i === 0 ? 'completed' : i === 3 ? 'onboarding' : 'active'
      });

      const templateToUse = data.dept === 'Engineering' ? engineeringTemplate : generalTemplate;

      const onboarding = await Onboarding.create({
        employee: employee._id,
        template: templateToUse._id,
        startDate: joinDate,
        expectedCompletionDate: expDate,
        status: i === 0 ? 'completed' : i === 2 || i === 5 ? 'delayed' : 'in_progress',
        readinessScore: i === 0 ? 100 : i === 2 ? 45 : 75,
        createdBy: hrManagers[0]._id
      });

      employee.onboarding = onboarding._id;
      await employee.save();

      // Create Tasks for this employee
      const taskDocs = [];
      const now = new Date();

      for (let j = 0; j < templateToUse.taskDefinitions.length; j++) {
        const def = templateToUse.taskDefinitions[j];
        const taskDueDate = new Date(joinDate);
        taskDueDate.setDate(taskDueDate.getDate() + def.dueOffsetDays);

        let owner = itTeam[j % itTeam.length]._id;
        if (def.category === 'HR') owner = hrManagers[j % hrManagers.length]._id;
        if (def.category === 'Workplace') owner = data.manager._id;
        if (def.category === 'Training' && def.assignTo === 'employee') owner = empUser._id;

        // Variety of statuses: Completed, In Progress, Blocked, Overdue
        let taskStatus = 'not_started';
        let blockerReason = null;
        let blockedAt = null;
        let blockedBy = null;
        let completedAt = null;

        if (i === 0) {
          // All completed for first employee
          taskStatus = 'completed';
          completedAt = new Date(joinDate.getTime() + j * 86400000);
        } else if (j === 0) {
          // Hardware task completed
          taskStatus = 'completed';
          completedAt = new Date(joinDate);
        } else if (i === 2 && j === 2) {
          // Blocked task: VPN credentials
          taskStatus = 'blocked';
          blockerReason = 'Waiting for corporate security approval on external IP range & Okta token provisioning';
          blockedAt = new Date(now.getTime() - 2 * 86400000);
          blockedBy = itTeam[0]._id;
        } else if (i === 4 && j === 1) {
          // Blocked task: Hardware delivery
          taskStatus = 'blocked';
          blockerReason = 'MacBook shipment held at international customs depot; tracking number #FEDEX-90218';
          blockedAt = new Date(now.getTime() - 3 * 86400000);
          blockedBy = hrManagers[0]._id;
        } else if (taskDueDate < now && j > 2) {
          // Overdue task
          taskStatus = 'overdue';
        } else if (j <= 3) {
          taskStatus = 'in_progress';
        }

        const task = await Task.create({
          title: def.title,
          description: def.description,
          onboarding: onboarding._id,
          employee: employee._id,
          assignedOwner: owner,
          department: deptId,
          category: def.category,
          priority: def.priority,
          status: taskStatus,
          dueDate: taskDueDate,
          completedAt,
          blockerReason,
          blockedAt,
          blockedBy
        });

        taskDocs.push(task._id);
        totalTasksCreated++;
      }

      onboarding.tasks = taskDocs;
      // Calculate realistic readiness score
      const compCount = i === 0 ? templateToUse.taskDefinitions.length : 3;
      onboarding.readinessScore = Math.round((compCount / templateToUse.taskDefinitions.length) * 100);
      await onboarding.save();
    }

    console.log(`✅ Created 10 Employees with ${totalTasksCreated} onboarding tasks total!`);

    console.log('🔔 Generating Seed Notifications...');
    await Notification.create([
      {
        recipient: admin._id,
        title: 'New Employee Cohort Initialized',
        message: '10 new hires successfully enrolled into onboarding pipelines.',
        type: 'task_assigned',
        isRead: false
      },
      {
        recipient: itTeam[0]._id,
        title: 'CRITICAL BLOCKER: VPN & SSO Access',
        message: 'Liam O\'Sullivan is blocked on task: Configure Company VPN & Okta SSO.',
        type: 'blocker_created',
        isRead: false
      },
      {
        recipient: hrManagers[0]._id,
        title: 'Hardware Logistics Blocker Flagged',
        message: 'Ethan Patel is blocked on laptop shipment customs delay.',
        type: 'blocker_created',
        isRead: false
      },
      {
        recipient: deptManagers[0]._id,
        title: 'Upcoming Milestone: First PR Review',
        message: 'Sophia Martinez is due to submit her first onboarding pull request tomorrow.',
        type: 'deadline_approaching',
        isRead: true
      }
    ]);

    console.log('⚡ Generating Activity Audit Logs...');
    await ActivityLog.create([
      {
        actor: hrManagers[0]._id,
        action: 'create_employee',
        entityType: 'Employee',
        description: 'Enrolled Alexander Wright into Engineering Onboarding Standard.',
        createdAt: new Date(Date.now() - 4 * 86400000)
      },
      {
        actor: itTeam[0]._id,
        action: 'block_task',
        entityType: 'Task',
        description: 'Flagged blocker on VPN & Okta SSO for Liam O\'Sullivan.',
        createdAt: new Date(Date.now() - 2 * 86400000)
      },
      {
        actor: itTeam[1]._id,
        action: 'complete_task',
        entityType: 'Task',
        description: 'Completed Provision MacBook Pro M3 for Sophia Martinez.',
        createdAt: new Date(Date.now() - 1 * 86400000)
      }
    ]);

    console.log('===========================================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('Demo Credentials:');
    console.log('  Admin:       admin@onboardingchecklist.com / Admin@123');
    console.log('  HR Manager:  sarah.jenkins@onboardingchecklist.com / Admin@123');
    console.log('  IT Team:     marcus.vance@onboardingchecklist.com / Admin@123');
    console.log('  Dept Mgr:    david.kim@onboardingchecklist.com / Admin@123');
    console.log('  Employee:    alex.wright@onboardingchecklist.com / Admin@123');
    console.log('===========================================================');
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
};

if (require.main === module) {
  seedData().then(() => process.exit(0));
}

module.exports = seedData;
