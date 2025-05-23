const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/todos');

const TaskSchema = new mongoose.Schema({ task: String });
const Task = mongoose.model('Task', TaskSchema);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get all tasks
app.get('/todos', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Add new task
app.post('/todos', async (req, res) => {
  const task = new Task({ task: req.body.task });
  await task.save();
  res.status(201).json(task);
});

// Delete task
app.delete('/todos/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
