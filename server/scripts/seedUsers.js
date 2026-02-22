const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course');

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    const password = 'Password123!';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Define users to create
    const usersData = [
      // Students at different levels
      {
        name: 'Suleiman Abdulkadir',
        regNo: 'UG15/CS/1001',
        email: 'suleiman.abdulkadir@student.edu',
        level: '100',
        role: 'student'
      },
      {
        name: 'Usman Dayyubu',
        regNo: 'UG15/CS/1002',
        email: 'usman.dayyubu@student.edu',
        level: '100',
        role: 'student'
      },
      {
        name: 'Abdulhalim Ibrahim',
        regNo: 'UG15/CS/2001',
        email: 'abdulhalim.ibrahim@student.edu',
        level: '200',
        role: 'student'
      },
      {
        name: 'Amina Yusuf',
        regNo: 'UG15/CS/2002',
        email: 'amina.yusuf@student.edu',
        level: '200',
        role: 'student'
      },
      {
        name: 'Fatima Muhammad',
        regNo: 'UG15/CS/3001',
        email: 'fatima.muhammad@student.edu',
        level: '300',
        role: 'student'
      },
      {
        name: 'Ibrahim Aliyu',
        regNo: 'UG15/CS/3002',
        email: 'ibrahim.aliyu@student.edu',
        level: '300',
        role: 'student'
      },
      {
        name: 'Aisha Bello',
        regNo: 'UG15/CS/4001',
        email: 'aisha.bello@student.edu',
        level: '400',
        role: 'student'
      },
      {
        name: 'Musa Garba',
        regNo: 'UG15/CS/4002',
        email: 'musa.garba@student.edu',
        level: '400',
        role: 'student'
      },
      // Admin users
      {
        name: 'Admin User',
        regNo: 'UG15/CS/ADMIN01',
        email: 'admin@university.edu',
        level: '100',
        role: 'admin'
      },
      {
        name: 'Dr. Kabir Sani',
        regNo: 'UG15/CS/ADMIN02',
        email: 'kabir.sani@university.edu',
        level: '100',
        role: 'admin'
      }
    ];

    const createdUsers = [];

    // Create each user with sample course registrations
    for (const userData of usersData) {
      let registeredCourses = [];

      // Only register courses for students
      if (userData.role === 'student') {
        // Build a realistic course history based on student level
        // Students should have completed courses from previous levels
        
        const coursesToRegister = [];
        
        // Level 100 students: Register level 100 courses only
        if (userData.level === '100') {
          const level100Courses = await Course.find({ 
            level: '100', 
            semester: 1 
          }).limit(5);
          coursesToRegister.push(...level100Courses);
        }
        
        // Level 200 students: Register some level 100 + level 200 courses
        if (userData.level === '200') {
          // Add prerequisite level 100 courses
          const level100Courses = await Course.find({ 
            level: '100',
            courseCode: { $in: ['CSC1102', 'CSC1104', 'CSC1105'] }
          });
          coursesToRegister.push(...level100Courses);
          
          // Add level 200 courses
          const level200Courses = await Course.find({ 
            level: '200', 
            semester: 1 
          }).limit(3);
          coursesToRegister.push(...level200Courses);
        }
        
        // Level 300 students: Register level 100 + 200 + 300 courses
        if (userData.level === '300') {
          // Add prerequisite level 100 courses
          const level100Courses = await Course.find({ 
            level: '100',
            courseCode: { $in: ['CSC1102', 'CSC1104', 'CSC1105', 'CSC1203'] }
          });
          coursesToRegister.push(...level100Courses);
          
          // Add prerequisite level 200 courses
          const level200Courses = await Course.find({ 
            level: '200',
            courseCode: { $in: ['CSC2101', 'CSC2102', 'CSC2103', 'CSC2104'] }
          });
          coursesToRegister.push(...level200Courses);
          
          // Add level 300 courses
          const level300Courses = await Course.find({ 
            level: '300', 
            semester: 1 
          }).limit(2);
          coursesToRegister.push(...level300Courses);
        }
        
        // Level 400 students: Register courses from all levels
        if (userData.level === '400') {
          // Add prerequisite level 100 courses
          const level100Courses = await Course.find({ 
            level: '100',
            courseCode: { $in: ['CSC1102', 'CSC1104', 'CSC1105', 'CSC1203'] }
          });
          coursesToRegister.push(...level100Courses);
          
          // Add prerequisite level 200 courses
          const level200Courses = await Course.find({ 
            level: '200',
            courseCode: { $in: ['CSC2101', 'CSC2102', 'CSC2103', 'CSC2104'] }
          });
          coursesToRegister.push(...level200Courses);
          
          // Add prerequisite level 300 courses
          const level300Courses = await Course.find({ 
            level: '300',
            courseCode: { $in: ['CSC3101', 'CSC3102', 'CSC3103'] }
          });
          coursesToRegister.push(...level300Courses);
          
          // Add level 400 courses (only those with met prerequisites)
          const level400Courses = await Course.find({ 
            level: '400',
            courseCode: { $in: ['CSC4101', 'CSC4102', 'CSC4103', 'CSC4105'] }
          });
          coursesToRegister.push(...level400Courses);
        }
        
        registeredCourses = coursesToRegister.map(course => course._id);

        // Update enrolled count for registered courses
        if (registeredCourses.length > 0) {
          await Course.updateMany(
            { _id: { $in: registeredCourses } },
            { $inc: { enrolledCount: 1 } }
          );
        }
      }

      const user = await User.create({
        ...userData,
        password: hashedPassword,
        registeredCourses
      });

      createdUsers.push({
        name: user.name,
        email: user.email,
        regNo: user.regNo,
        role: user.role,
        level: user.level,
        coursesCount: registeredCourses.length
      });
    }

    console.log('\nCreated users:');
    console.log('='.repeat(80));
    console.log(`Password for all users: ${password}`);
    console.log('='.repeat(80));
    
    console.log('\nSTUDENTS:');
    createdUsers.filter(u => u.role === 'student').forEach(user => {
      console.log(`  ${user.name}`);
      console.log(`    Email: ${user.email}`);
      console.log(`    RegNo: ${user.regNo}`);
      console.log(`    Level: ${user.level}`);
      console.log(`    Registered Courses: ${user.coursesCount}`);
      console.log('');
    });

    console.log('ADMINS:');
    createdUsers.filter(u => u.role === 'admin').forEach(user => {
      console.log(`  ${user.name}`);
      console.log(`    Email: ${user.email}`);
      console.log(`    RegNo: ${user.regNo}`);
      console.log('');
    });

    console.log('='.repeat(80));
    console.log(`Total users created: ${createdUsers.length}`);
    console.log(`  - Students: ${createdUsers.filter(u => u.role === 'student').length}`);
    console.log(`  - Admins: ${createdUsers.filter(u => u.role === 'admin').length}`);

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
