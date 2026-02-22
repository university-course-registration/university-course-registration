const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  courseName: { type: String, required: true },
  semester: { type: Number, enum: [1, 2], required: true },
  creditUnit: { type: Number, enum: [2, 3], required: true },
  level: { type: String, required: true, enum: ['100', '200', '300', '400', '500'] },
  prerequisites: { type: [String], default: [] },
  capacity: { type: Number, default: 50 },
  enrolledCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isArchived: { type: Boolean, default: false },
  archivedAt: { type: Date, default: null }
});

// Virtual field for available seats
CourseSchema.virtual('availableSeats').get(function() {
  return this.capacity - this.enrolledCount;
});

// Virtual field to check if course is full
CourseSchema.virtual('isFull').get(function() {
  return this.enrolledCount >= this.capacity;
});

// Ensure virtuals are included in JSON output
CourseSchema.set('toJSON', { virtuals: true });
CourseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Course', CourseSchema);