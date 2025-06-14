const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Get all tasks
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.json(tasks);
});

// Add a task
router.post("/", auth, async (req, res) => {
  const { title, description, status } = req.body;
  const task = await Task.create({ title, description, status, user: req.user._id });
  res.status(201).json(task);
});

// Update a task
router.put("/:id", auth, async (req, res) => {
  const updated = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  res.json(updated);
});

// Delete a task
router.delete("/:id", auth, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: "Task deleted" });
});

module.exports = router;
