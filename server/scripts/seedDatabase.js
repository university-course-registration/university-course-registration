const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../models/Course');

dotenv.config();

// Sample courses for BUK - Computer Science Department
const sampleCourses = [
  // Semester 1 Courses (20 courses)
  { courseCode: 'CSC1101', courseName: 'Introduction to Computer Science', semester: 1, creditUnit: 3, level: '100', prerequisites: [], capacity: 100, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC1102', courseName: 'Programming Fundamentals', semester: 1, creditUnit: 3, level: '100', prerequisites: [], capacity: 100, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC1103', courseName: 'Digital Logic Design', semester: 1, creditUnit: 2, level: '100', prerequisites: [], capacity: 80, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC1104', courseName: 'Computer Organization', semester: 1, creditUnit: 3, level: '100', prerequisites: [], capacity: 80, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC1105', courseName: 'Mathematics for Computing I', semester: 1, creditUnit: 3, level: '100', prerequisites: [], capacity: 100, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC2101', courseName: 'Data Structures', semester: 1, creditUnit: 3, level: '200', prerequisites: ['CSC1102'], capacity: 60, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC2102', courseName: 'Algorithms I', semester: 1, creditUnit: 3, level: '200', prerequisites: ['CSC1102', 'CSC1105'], capacity: 60, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC2103', courseName: 'Database Systems I', semester: 1, creditUnit: 3, level: '200', prerequisites: ['CSC1102'], capacity: 50, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC2104', courseName: 'Operating Systems I', semester: 1, creditUnit: 3, level: '200', prerequisites: ['CSC1104'], capacity: 50, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC2105', courseName: 'Web Development I', semester: 1, creditUnit: 2, level: '200', prerequisites: ['CSC1202'], capacity: 40, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC3101', courseName: 'Software Engineering I', semester: 1, creditUnit: 3, level: '300', prerequisites: ['CSC2101'], capacity: 40, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC3102', courseName: 'Artificial Intelligence', semester: 1, creditUnit: 3, level: '300', prerequisites: ['CSC2102'], capacity: 35, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC3103', courseName: 'Network Fundamentals', semester: 1, creditUnit: 3, level: '300', prerequisites: ['CSC1203'], capacity: 40, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC3104', courseName: 'Compiler Design I', semester: 1, creditUnit: 2, level: '300', prerequisites: ['CSC2102'], capacity: 30, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC3105', courseName: 'Database Administration', semester: 1, creditUnit: 2, level: '300', prerequisites: ['CSC2103'], capacity: 30, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC4101', courseName: 'Distributed Systems', semester: 1, creditUnit: 3, level: '400', prerequisites: ['CSC2104', 'CSC3103'], capacity: 30, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC4102', courseName: 'Cloud Computing', semester: 1, creditUnit: 3, level: '400', prerequisites: ['CSC3103'], capacity: 30, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC4103', courseName: 'Machine Learning I', semester: 1, creditUnit: 3, level: '400', prerequisites: ['CSC3102'], capacity: 25, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC4104', courseName: 'Cybersecurity Fundamentals', semester: 1, creditUnit: 2, level: '400', prerequisites: ['CSC3103'], capacity: 25, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC4105', courseName: 'Research Methods in Computing', semester: 1, creditUnit: 2, level: '400', prerequisites: [], capacity: 40, enrolledCount: 0, isActive: true, isArchived: false },

  // Semester 2 Courses (20 courses)
  { courseCode: 'CSC1201', courseName: 'Discrete Mathematics', semester: 2, creditUnit: 3, level: '100', prerequisites: [], capacity: 100, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC1202', courseName: 'Object-Oriented Programming', semester: 2, creditUnit: 3, level: '100', prerequisites: ['CSC1102'], capacity: 100, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC1203', courseName: 'Computer Networks Basics', semester: 2, creditUnit: 2, level: '100', prerequisites: [], capacity: 80, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC1204', courseName: 'Web Design Fundamentals', semester: 2, creditUnit: 3, level: '100', prerequisites: [], capacity: 80, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC1205', courseName: 'Mathematics for Computing II', semester: 2, creditUnit: 3, level: '100', prerequisites: ['CSC1105'], capacity: 100, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC2201', courseName: 'Algorithms II', semester: 2, creditUnit: 3, level: '200', prerequisites: ['CSC2102'], capacity: 60, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC2202', courseName: 'Database Systems II', semester: 2, creditUnit: 3, level: '200', prerequisites: ['CSC2103'], capacity: 50, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC2203', courseName: 'Operating Systems II', semester: 2, creditUnit: 3, level: '200', prerequisites: ['CSC2104'], capacity: 50, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC2204', courseName: 'Web Development II', semester: 2, creditUnit: 3, level: '200', prerequisites: ['CSC2105'], capacity: 40, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC2205', courseName: 'Computer Graphics', semester: 2, creditUnit: 2, level: '200', prerequisites: ['CSC1105'], capacity: 40, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC3201', courseName: 'Software Engineering II', semester: 2, creditUnit: 3, level: '300', prerequisites: ['CSC3101'], capacity: 40, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC3202', courseName: 'Data Mining', semester: 2, creditUnit: 3, level: '300', prerequisites: ['CSC2103', 'CSC2102'], capacity: 35, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC3203', courseName: 'Network Security', semester: 2, creditUnit: 3, level: '300', prerequisites: ['CSC3103'], capacity: 40, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC3204', courseName: 'Compiler Design II', semester: 2, creditUnit: 2, level: '300', prerequisites: ['CSC3104'], capacity: 30, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC3205', courseName: 'Mobile Application Development', semester: 2, creditUnit: 2, level: '300', prerequisites: ['CSC2204'], capacity: 30, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC4201', courseName: 'Open Source Software', semester: 2, creditUnit: 3, level: '400', prerequisites: ['CSC3101'], capacity: 30, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC4202', courseName: 'IoT and Embedded Systems', semester: 2, creditUnit: 3, level: '400', prerequisites: ['CSC2104'], capacity: 30, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC4203', courseName: 'Machine Learning II', semester: 2, creditUnit: 3, level: '400', prerequisites: ['CSC4103'], capacity: 25, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC4204', courseName: 'Advanced Cybersecurity', semester: 2, creditUnit: 2, level: '400', prerequisites: ['CSC4104'], capacity: 25, enrolledCount: 0, isActive: true, isArchived: false },
  { courseCode: 'CSC4205', courseName: 'Project and Seminar', semester: 2, creditUnit: 2, level: '400', prerequisites: [], capacity: 40, enrolledCount: 0, isActive: true, isArchived: false }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Insert sample courses
    const result = await Course.insertMany(sampleCourses);
    console.log(`\nSuccessfully seeded ${result.length} courses into the database`);
    console.log(`  - Semester 1: 20 courses`);
    console.log(`  - Semester 2: 20 courses`);
    console.log(`  - Levels: 100, 200, 300, 400`);
    console.log(`  - Credit Units: 2-3 units per course\n`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
