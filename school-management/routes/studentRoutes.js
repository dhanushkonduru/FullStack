const express = require('express')
const router = express.Router()
const Student = require('../models/Student')

router.get('/', async (req, res) => {
  const students = await Student.find().populate('class')
  res.json(students)
})

router.post('/', async (req, res) => {
  const student = new Student(req.body)
  await student.save()
  res.json(student)
})

router.put('/:id', async (req, res) => {
  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(updated)
})

router.delete('/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id)
  res.json({ message: 'Student deleted' })
})

module.exports = router
