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
  
  if (!title || !title.trim()) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const newTask = new Task({
      user: req.user.id,
      title: title.trim(),
      description: description?.trim(),
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Create Task Error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Task with this title already exists' });
    }
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
exports.getTaskStatistics = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    
    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'done').length,
      pending: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      highPriority: tasks.filter(t => t.priority === 'high').length,
      dueSoon: tasks.filter(t => 
        t.dueDate && 
        new Date(t.dueDate) > new Date() &&
        new Date(t.dueDate) < new Date(Date.now() + 7*24*60*60*1000)
      ).length
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};