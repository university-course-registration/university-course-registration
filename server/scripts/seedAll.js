const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { execSync } = require('child_process');

dotenv.config();

const seedAll = async () => {
  try {
    console.log('='.repeat(80));
    console.log('Starting Database Seeding Process');
    console.log('='.repeat(80));
    console.log('');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');
    console.log('');

    // Close the connection before running seed scripts
    await mongoose.connection.close();

    // Seed courses first
    console.log('Step 1: Seeding Courses...');
    console.log('-'.repeat(80));
    execSync('node scripts/seedDatabase.js', { stdio: 'inherit', cwd: __dirname + '/..' });
    console.log('');

    // Seed users
    console.log('Step 2: Seeding Users...');
    console.log('-'.repeat(80));
    execSync('node scripts/seedUsers.js', { stdio: 'inherit', cwd: __dirname + '/..' });
    console.log('');

    console.log('='.repeat(80));
    console.log('✓ Database Seeding Complete!');
    console.log('='.repeat(80));
    console.log('');
    console.log('You can now start the server with: npm run dev');
    console.log('');

  } catch (error) {
    console.error('Error during seeding process:', error);
    process.exit(1);
  }
};

seedAll();
