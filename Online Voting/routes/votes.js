const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');
const auth = require('../middleware/auth');

// Cast a vote - protected
router.post('/', auth, async (req, res) => {
  try {
    const vote = new Vote({
      voterName: req.user.userId,
      candidate: req.body.candidate
    });
    await vote.save();
    await Candidate.findByIdAndUpdate(req.body.candidate, { $inc: { voteCount: 1 } });
    res.status(201).json(vote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all votes
router.get('/', async (req, res) => {
  const votes = await Vote.find().populate('candidate');
  res.json(votes);
});

module.exports = router;
