const Course = require('../../../models/Course');

describe('Course Model', () => {
  describe('Schema Validation', () => {
    it('should create a valid course', async () => {
      const courseData = {
        courseCode: 'CS101',
        courseName: 'Introduction to Computer Science',
        semester: 1,
        creditUnit: 3,
        level: '100'
      };

      const course = new Course(courseData);
      const savedCourse = await course.save();

      expect(savedCourse._id).toBeDefined();
      expect(savedCourse.courseCode).toBe(courseData.courseCode);
      expect(savedCourse.courseName).toBe(courseData.courseName);
      expect(savedCourse.semester).toBe(courseData.semester);
      expect(savedCourse.creditUnit).toBe(courseData.creditUnit);
      expect(savedCourse.level).toBe(courseData.level);
    });

    it('should fail validation when courseCode is missing', async () => {
      const courseData = {
        courseName: 'Test Course',
        semester: 1,
        creditUnit: 3,
        level: '100'
      };

      const course = new Course(courseData);
      
      await expect(course.save()).rejects.toThrow();
    });

    it('should fail validation when courseName is missing', async () => {
      const courseData = {
        courseCode: 'CS102',
        semester: 1,
        creditUnit: 3,
        level: '100'
      };

      const course = new Course(courseData);
      
      await expect(course.save()).rejects.toThrow();
    });

    it('should fail validation when semester is missing', async () => {
      const courseData = {
        courseCode: 'CS103',
        courseName: 'Test Course',
        creditUnit: 3,
        level: '100'
      };

      const course = new Course(courseData);
      
      await expect(course.save()).rejects.toThrow();
    });

    it('should fail validation when creditUnit is missing', async () => {
      const courseData = {
        courseCode: 'CS104',
        courseName: 'Test Course',
        semester: 1,
        level: '100'
      };

      const course = new Course(courseData);
      
      await expect(course.save()).rejects.toThrow();
    });

    it('should fail validation when level is missing', async () => {
      const courseData = {
        courseCode: 'CS105',
        courseName: 'Test Course',
        semester: 1,
        creditUnit: 3
      };

      const course = new Course(courseData);
      
      await expect(course.save()).rejects.toThrow();
    });

    it('should fail validation with invalid semester', async () => {
      const courseData = {
        courseCode: 'CS106',
        courseName: 'Test Course',
        semester: 3, // Invalid semester
        creditUnit: 3,
        level: '100'
      };

      const course = new Course(courseData);
      
      await expect(course.save()).rejects.toThrow();
    });

    it('should fail validation with invalid creditUnit', async () => {
      const courseData = {
        courseCode: 'CS107',
        courseName: 'Test Course',
        semester: 1,
        creditUnit: 4, // Invalid credit unit
        level: '100'
      };

      const course = new Course(courseData);
      
      await expect(course.save()).rejects.toThrow();
    });

    it('should fail validation with invalid level', async () => {
      const courseData = {
        courseCode: 'CS108',
        courseName: 'Test Course',
        semester: 1,
        creditUnit: 3,
        level: '600' // Invalid level
      };

      const course = new Course(courseData);
      
      await expect(course.save()).rejects.toThrow();
    });

    it('should enforce unique courseCode', async () => {
      const courseData1 = {
        courseCode: 'CS109',
        courseName: 'Course One',
        semester: 1,
        creditUnit: 3,
        level: '100'
      };

      const courseData2 = {
        courseCode: 'CS109', // Duplicate courseCode
        courseName: 'Course Two',
        semester: 2,
        creditUnit: 2,
        level: '200'
      };

      await Course.create(courseData1);
      
      await expect(Course.create(courseData2)).rejects.toThrow();
    });

    it('should accept semester 1', async () => {
      const courseData = {
        courseCode: 'CS110',
        courseName: 'Semester 1 Course',
        semester: 1,
        creditUnit: 3,
        level: '100'
      };

      const course = await Course.create(courseData);
      expect(course.semester).toBe(1);
    });

    it('should accept semester 2', async () => {
      const courseData = {
        courseCode: 'CS111',
        courseName: 'Semester 2 Course',
        semester: 2,
        creditUnit: 3,
        level: '100'
      };

      const course = await Course.create(courseData);
      expect(course.semester).toBe(2);
    });

    it('should accept creditUnit 2', async () => {
      const courseData = {
        courseCode: 'CS112',
        courseName: '2 Credit Course',
        semester: 1,
        creditUnit: 2,
        level: '100'
      };

      const course = await Course.create(courseData);
      expect(course.creditUnit).toBe(2);
    });

    it('should accept creditUnit 3', async () => {
      const courseData = {
        courseCode: 'CS113',
        courseName: '3 Credit Course',
        semester: 1,
        creditUnit: 3,
        level: '100'
      };

      const course = await Course.create(courseData);
      expect(course.creditUnit).toBe(3);
    });

    it('should accept all valid level values', async () => {
      const levels = ['100', '200', '300', '400', '500'];
      
      for (let i = 0; i < levels.length; i++) {
        const courseData = {
          courseCode: `CS${114 + i}`,
          courseName: `Level ${levels[i]} Course`,
          semester: 1,
          creditUnit: 3,
          level: levels[i]
        };

        const course = await Course.create(courseData);
        expect(course.level).toBe(levels[i]);
      }
    });

    it('should allow courses with same name but different codes', async () => {
      const courseData1 = {
        courseCode: 'CS119',
        courseName: 'Duplicate Name Course',
        semester: 1,
        creditUnit: 3,
        level: '100'
      };

      const courseData2 = {
        courseCode: 'CS120',
        courseName: 'Duplicate Name Course', // Same name, different code
        semester: 1,
        creditUnit: 3,
        level: '100'
      };

      const course1 = await Course.create(courseData1);
      const course2 = await Course.create(courseData2);

      expect(course1.courseName).toBe(course2.courseName);
      expect(course1.courseCode).not.toBe(course2.courseCode);
    });
  });
});
