const { validatePrerequisites } = require('../../controllers/courseController');

describe('validatePrerequisites', () => {
  it('should return valid when no prerequisites exist', () => {
    const student = {
      registeredCourses: []
    };
    const course = {
      courseCode: 'CSC101',
      prerequisites: []
    };

    const result = validatePrerequisites(student, course);

    expect(result.valid).toBe(true);
    expect(result.missing).toEqual([]);
  });

  it('should return valid when all prerequisites are met', () => {
    const student = {
      registeredCourses: [
        { courseCode: 'CSC101' },
        { courseCode: 'CSC102' }
      ]
    };
    const course = {
      courseCode: 'CSC201',
      prerequisites: ['CSC101', 'CSC102']
    };

    const result = validatePrerequisites(student, course);

    expect(result.valid).toBe(true);
    expect(result.missing).toEqual([]);
  });

  it('should return invalid when prerequisites are missing', () => {
    const student = {
      registeredCourses: [
        { courseCode: 'CSC101' }
      ]
    };
    const course = {
      courseCode: 'CSC301',
      prerequisites: ['CSC101', 'CSC201', 'CSC202']
    };

    const result = validatePrerequisites(student, course);

    expect(result.valid).toBe(false);
    expect(result.missing).toEqual(['CSC201', 'CSC202']);
  });

  it('should handle course codes as strings in registeredCourses', () => {
    const student = {
      registeredCourses: ['CSC101', 'CSC102']
    };
    const course = {
      courseCode: 'CSC201',
      prerequisites: ['CSC101']
    };

    const result = validatePrerequisites(student, course);

    expect(result.valid).toBe(true);
    expect(result.missing).toEqual([]);
  });

  it('should return invalid when student has no registered courses', () => {
    const student = {
      registeredCourses: []
    };
    const course = {
      courseCode: 'CSC201',
      prerequisites: ['CSC101']
    };

    const result = validatePrerequisites(student, course);

    expect(result.valid).toBe(false);
    expect(result.missing).toEqual(['CSC101']);
  });
});
