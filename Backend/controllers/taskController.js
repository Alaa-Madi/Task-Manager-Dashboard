const Task = require('../models/Task');

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new task
exports.createTask = async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  try {
    const newTask = new Task({
      user: req.user.id,
      title,
      description,
      status,
      priority,
      dueDate,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Create Task Error:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};
