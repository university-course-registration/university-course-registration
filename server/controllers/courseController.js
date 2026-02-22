const Course = require('../models/Course');
const User = require('../models/User');

// Helper function to validate prerequisites
const validatePrerequisites = (student, course) => {
  // Get the course codes of all registered courses
  const registeredCourseCodes = student.registeredCourses.map(c => 
    typeof c === 'object' ? c.courseCode : c
  );
  
  // Find missing prerequisites
  const missingPrereqs = course.prerequisites.filter(
    prereq => !registeredCourseCodes.includes(prereq)
  );
  
  return {
    valid: missingPrereqs.length === 0,
    missing: missingPrereqs
  };
};

// Get all available courses
const getAllCourses = async (req, res, next) => {
  try {
    const { level, includeLevels, search, semester } = req.query;

    // Build query object - exclude archived courses for students
    const query = { isArchived: false, isActive: true };

    // Level filtering
    if (level) {
      let levelsToInclude = [level];
      
      if (includeLevels) {
        const additionalLevels = includeLevels.split(',').map(l => l.trim());
        levelsToInclude = [...new Set([...levelsToInclude, ...additionalLevels])];
      }
      
      query.level = { $in: levelsToInclude };
    }

    // Search filtering (case-insensitive regex for courseCode or courseName)
    if (search) {
      query.$or = [
        { courseCode: { $regex: search, $options: 'i' } },
        { courseName: { $regex: search, $options: 'i' } }
      ];
    }

    // Semester filtering
    if (semester) {
      query.semester = Number(semester);
    }

    // Find courses that match the query
    const courses = await Course.find(query).sort({ level: 1, courseCode: 1 });

    res.status(200).json({
      status: 'success',
      count: courses.length,
      currentLevel: level,
      levelsIncluded: level ? (includeLevels ? [level, ...includeLevels.split(',').map(l => l.trim())] : [level]) : undefined,
      message: courses.length > 0 ? 'Courses retrieved successfully' : 'No courses found',
      data: courses
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    next(error); // Forward to error handler
  }
};

// Register courses for a student
const registerCourses = async (req, res, next) => {
  try {
    const { courseIds, userId } = req.body;

    // Fetch the user with their registered courses
    const user = await User.findById(userId).populate('registeredCourses');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        status: 'error',
        error: 'Not Found',
        message: 'User not found' 
      });
    }

    // Fetch the courses from the database
    const courses = await Course.find({ _id: { $in: courseIds } });

    // Check if all courses were found
    if (courses.length !== courseIds.length) {
      return res.status(404).json({ 
        success: false,
        status: 'error',
        error: 'Not Found',
        message: 'One or more courses not found' 
      });
    }

    // Check capacity for each course
    const capacityErrors = [];
    for (const course of courses) {
      if (course.enrolledCount >= course.capacity) {
        capacityErrors.push({
          courseCode: course.courseCode,
          courseName: course.courseName,
          capacity: course.capacity,
          enrolledCount: course.enrolledCount
        });
      }
    }

    if (capacityErrors.length > 0) {
      return res.status(400).json({
        success: false,
        status: 'error',
        error: 'Validation Error',
        message: 'Some courses are full',
        capacityErrors
      });
    }

    // Validate prerequisites for each course
    const prerequisiteErrors = [];
    for (const course of courses) {
      if (course.prerequisites && course.prerequisites.length > 0) {
        const validation = validatePrerequisites(user, course);
        if (!validation.valid) {
          prerequisiteErrors.push({
            courseCode: course.courseCode,
            courseName: course.courseName,
            missingPrerequisites: validation.missing
          });
        }
      }
    }

    // If there are prerequisite errors, return them
    if (prerequisiteErrors.length > 0) {
      return res.status(400).json({
        success: false,
        status: 'error',
        error: 'Validation Error',
        message: 'Prerequisites not met for some courses',
        prerequisiteErrors
      });
    }

    // Calculate the total credit units
    const totalCreditUnits = courses.reduce((sum, course) => sum + course.creditUnit, 0);

    // Check if total exceeds 36 units
    if (totalCreditUnits > 36) {
      return res.status(400).json({ 
        success: false,
        status: 'error',
        error: 'Validation Error',
        message: 'Credit unit limit exceeded (Max: 36)',
        totalCreditUnits
      });
    }

    // Update the user's registeredCourses field
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { registeredCourses: courseIds },
      { new: true, runValidators: true }
    ).populate('registeredCourses');

    // Increment enrolledCount for each course
    await Promise.all(
      courses.map(course => 
        Course.findByIdAndUpdate(
          course._id,
          { $inc: { enrolledCount: 1 } }
        )
      )
    );

    // Return success response with updated user
    res.status(200).json({
      status: 'success',
      message: 'Courses registered successfully',
      totalCreditUnits,
      user: updatedUser
    });

  } catch (error) {
    console.error('Error registering courses:', error);
    next(error); // Forward to error handler
  }
};

// Get registered courses for the logged-in student
const getRegisteredCourses = async (req, res, next) => {
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

    const registeredCourses = user.registeredCourses || [];
    const totalCreditUnits = registeredCourses.reduce(
      (sum, course) => sum + course.creditUnit,
      0
    );

    res.status(200).json({
      status: 'success',
      message: registeredCourses.length
        ? 'Registered courses retrieved successfully'
        : 'No registered courses found',
      totalCreditUnits,
      courses: registeredCourses
    });
  } catch (error) {
    console.error('Error fetching registered courses:', error);
    next(error); // Forward to error handler
  }
};

// Unregister from courses
const unregisterCourses = async (req, res, next) => {
  try {
    const { courseIds, userId } = req.body;

    if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({
        success: false,
        status: 'error',
        error: 'Validation Error',
        message: 'Course IDs are required'
      });
    }

    // Fetch the user
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        status: 'error',
        error: 'Not Found',
        message: 'User not found' 
      });
    }

    // Remove courses from user's registeredCourses
    const updatedCourses = user.registeredCourses.filter(
      courseId => !courseIds.includes(courseId.toString())
    );

    user.registeredCourses = updatedCourses;
    await user.save();

    // Decrement enrolledCount for each course
    await Promise.all(
      courseIds.map(courseId => 
        Course.findByIdAndUpdate(
          courseId,
          { $inc: { enrolledCount: -1 } }
        )
      )
    );

    // Populate and return updated user
    const populatedUser = await User.findById(userId).populate('registeredCourses');

    res.status(200).json({
      status: 'success',
      message: 'Courses unregistered successfully',
      user: populatedUser
    });

  } catch (error) {
    console.error('Error unregistering courses:', error);
    next(error);
  }
};

module.exports = {
  getAllCourses,
  registerCourses,
  getRegisteredCourses,
  unregisterCourses,
  validatePrerequisites // Export for testing
};
