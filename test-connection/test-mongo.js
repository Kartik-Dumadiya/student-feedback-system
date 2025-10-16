require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log('URI:', process.env.MONGO_URI.replace(/\/\/.*@/, '//<credentials>@'));
    
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log('📊 Database:', mongoose.connection.name);
    
    await mongoose.connection.close();
    console.log('👋 Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
}

testConnection();