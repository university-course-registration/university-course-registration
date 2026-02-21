const { Parser } = require('json2csv');
const User = require('../models/User');

// Export current user's registered courses to CSV
const exportMyCourses = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const user = await User.findById(userId).populate('registeredCourses');

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    // Map courses to CSV format
    const data = user.registeredCourses.map(course => ({
      courseCode: course.courseCode,
      courseName: course.courseName,
      creditUnits: course.creditUnit,
      semester: course.semester,
      level: course.level
    }));

    // Handle empty course list
    if (data.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'No courses to export'
      });
    }

    // Generate CSV
    const parser = new Parser();
    const csv = parser.parse(data);

    // Set headers for file download
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', `attachment; filename="registered-courses-${user.regNo}.csv"`);
    res.send(csv);

  } catch (error) {
    console.error('Error exporting courses:', error);
    next(error);
  }
};

// Export all student registrations to CSV (admin only)
const exportAllRegistrations = async (req, res, next) => {
  try {
    const students = await User.find({ role: 'student' }).populate('registeredCourses');

    const data = [];
    students.forEach(student => {
      student.registeredCourses.forEach(course => {
        data.push({
          studentName: student.name,
          regNo: student.regNo,
          email: student.email,
          level: student.level,
          courseCode: course.courseCode,
          courseName: course.courseName,
          creditUnits: course.creditUnit,
          semester: course.semester
        });
      });
    });

    // Handle empty data
    if (data.length === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'No registrations to export'
      });
    }

    // Generate CSV
    const parser = new Parser();
    const csv = parser.parse(data);

    // Set headers for file download
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="all-registrations.csv"');
    res.send(csv);

  } catch (error) {
    console.error('Error exporting all registrations:', error);
    next(error);
  }
};

module.exports = {
  exportMyCourses,
  exportAllRegistrations
};
