const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  regNo: { type: String, required: true, unique: true }, // Format like 'UG15/CS/1001'
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  level: { type: String, enum: ['100', '200', '300', '400', '500'], required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  registeredCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

module.exports = mongoose.model('User', UserSchema);