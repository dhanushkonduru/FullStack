require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const studentRoutes = require('./routes/studentRoutes')
const teacherRoutes = require('./routes/teacherRoutes')
const classRoutes = require('./routes/classRoutes')

const app = express()
const authRoutes = require('./routes/authRoutes')
app.use('/api/auth', authRoutes)

app.use(express.json())
app.use(cors())

// Serve static frontend files (index.html)
app.use(express.static('public'))

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err))

// Remove this line (optional): it overrides index.html
// app.get('/', (req, res) => {
//   res.send('✅ API is working')
// })

app.use('/api/students', studentRoutes)
app.use('/api/teachers', teacherRoutes)
app.use('/api/classes', classRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
