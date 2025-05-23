const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  branch: { type: String, required: true },
  year: { type: Number, required: true }
});

module.exports = mongoose.model('Student', studentSchema);
