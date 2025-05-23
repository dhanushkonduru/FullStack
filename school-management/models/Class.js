const mongoose = require('mongoose')

const classSchema = new mongoose.Schema({
  name: String,
  branch: String,
  year: Number,
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }]
})

module.exports = mongoose.model('Class', classSchema)
