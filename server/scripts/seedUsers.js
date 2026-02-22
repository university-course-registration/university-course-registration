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

    // Define users to create - Team Members
    const usersData = [
      // Students at different levels
      {
        name: 'Suleiman Abdulkadir',
        regNo: 'CST/20/SWE/00482',
        email: 'suleiman.abdulkadir@student.edu',
        level: '400',
        role: 'student'
      },
      {
        name: 'Usman Dayyabu Usman',
        regNo: 'CST/21/SWE/00652',
        email: 'usman.dayyabu@student.edu',
        level: '400',
        role: 'student'
      },
      {
        name: 'Abdulhalim Muhammad Yaro',
        regNo: 'CST/21/SWE/00663',
        email: 'abdulhalim.yaro@student.edu',
        level: '400',
        role: 'student'
      },
      {
        name: 'Suhaibu Salihu Musa',
        regNo: 'CST/20/SWE/00503',
        email: 'suhaibu.musa@student.edu',
        level: '400',
        role: 'student'
      },
      {
        name: 'Maryam Muhammad Bello',
        regNo: 'CST/20/SWE/00502',
        email: 'maryam.bello@student.edu',
        level: '400',
        role: 'student'
      },
      {
        name: 'Usman Muhammad Onimisi',
        regNo: 'CST/20/SWE/00513',
        email: 'usman.onimisi@student.edu',
        level: '400',
        role: 'student'
      },
      {
        name: 'Samaila Aliyu',
        regNo: 'CST/22/SWE/00922',
        email: 'samaila.aliyu@student.edu',
        level: '400',
        role: 'student'
      },
      {
        name: 'Achimugu Amina',
        regNo: 'CST/20/SWE/00483',
        email: 'achimugu.amina@student.edu',
        level: '400',
        role: 'student'
      },
      {
        name: 'Usman Alamin Umar',
        regNo: 'CST/20/SWE/00512',
        email: 'usman.umar@student.edu',
        level: '400',
        role: 'student'
      },
      {
        name: 'Tahir Musa Tahir',
        regNo: 'CST/21/SWE/00683',
        email: 'tahir.musa@student.edu',
        level: '400',
        role: 'student'
      },
      // Admin users
      {
        name: 'Admin User',
        regNo: 'ADMIN/001',
        email: 'admin@university.edu',
        level: '100',
        role: 'admin'
      },
      {
        name: 'Dr. Kabir Sani',
        regNo: 'ADMIN/002',
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
