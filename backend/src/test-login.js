import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/user.js';

dotenv.config();

const testLogin = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const user = await User.findOne({ email: 'test@example.com' });

  if (!user) {
    console.log('❌ User not found');
    process.exit(1);
  }

  console.log('✅ User found:');
  console.log('   Email:', user.email);
  console.log('   Username:', user.username);
  console.log('   Has password:', !!user.password);
  console.log('   Password hash length:', user.password?.length || 0);
  console.log('   Is Google User:', user.isGoogleUser);

  // Test password
  const testPassword = 'test123456';
  const isValid = await bcrypt.compare(testPassword, user.password);

  console.log('\n🔐 Password test:');
  console.log('   Testing password: test123456');
  console.log('   Result:', isValid ? '✅ Valid' : '❌ Invalid');

  await mongoose.connection.close();
  process.exit(0);
};

testLogin();
