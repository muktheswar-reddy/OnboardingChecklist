'use strict';

require('dotenv').config();

const app = require('./app');
const { connectDB } = require('./config/database');

const PORT = parseInt(process.env.PORT, 10) || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is empty
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Empty database detected. Auto-seeding initial workforce & templates...');
      const seedData = require('../scripts/seed');
      await seedData();
    }

    const server = app.listen(PORT, () => {
      console.log(`🚀 OnboardingChecklist API running on port ${PORT}`);
      console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
      console.log(`   Health check: http://localhost:${PORT}/health`);
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      console.log(`\n📴 Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        console.log('🔌 HTTP server closed');
        const { disconnectDB } = require('./config/database');
        await disconnectDB();
        process.exit(0);
      });

      // Force shutdown after 10s
      setTimeout(() => {
        console.error('⚠️  Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      shutdown('uncaughtException');
    });

    return server;
  } catch (err) {
    console.error('💀 Failed to start server:', err.message);
    process.exit(1);
  }
};

startServer();
