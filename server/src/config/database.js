'use strict';

const mongoose = require('mongoose');

let mongoServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/onboarding_checklist';

  const options = {
    serverSelectionTimeoutMS: 2000,
    socketTimeoutMS: 45000,
  };

  try {
    console.log(`📡 Connecting to MongoDB at ${uri}...`);
    await mongoose.connect(uri, options);
    console.log(`✅ MongoDB connected successfully: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`⚠️ Could not connect to external MongoDB: ${err.message}`);
    console.log(`🚀 Initializing In-Memory Embedded MongoDB for seamless local execution...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'onboarding_checklist'
        }
      });
      const inMemoryUri = mongoServer.getUri();
      await mongoose.connect(inMemoryUri, {
        serverSelectionTimeoutMS: 10000
      });
      console.log(`✅ In-Memory MongoDB connected: ${inMemoryUri}`);
    } catch (memErr) {
      console.error(`❌ Failed to start In-Memory MongoDB: ${memErr.message}`);
      throw memErr;
    }
  }

  mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB runtime error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected');
  });
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
    console.log('🔌 MongoDB connection closed gracefully');
  } catch (err) {
    console.error('Error closing MongoDB connection:', err.message);
  }
};

process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});

module.exports = { connectDB, disconnectDB };
