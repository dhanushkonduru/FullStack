const express = require('express')
const router = express.Router()
const Class = require('../models/Class')

router.get('/', async (req, res) => {
  try {
    const classes = await Class.find().populate('teacher').populate('students')
    res.json(classes)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error fetching classes' })
  }
})

router.post('/', async (req, res) => {
  try {
    const newClass = new Class(req.body)
    await newClass.save()
    res.json(newClass)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error creating class' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updated) return res.status(404).json({ message: 'Class not found' })
    res.json(updated)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error updating class' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Class.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Class not found' })
    res.json({ message: 'Class deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error deleting class' })
  }
})

module.exports = router
