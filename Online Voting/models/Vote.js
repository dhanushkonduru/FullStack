const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  voterName: { type: String, required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vote', voteSchema);
