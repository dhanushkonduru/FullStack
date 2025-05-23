// routes/authRoutes.js
const express = require('express')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey'

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    const user = new User({ name, email, password, role })
    await user.save()
    res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '1d'
    })
    res.json({ token, user: { name: user.name, role: user.role } })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
