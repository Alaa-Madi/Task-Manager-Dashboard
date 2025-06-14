const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Create token
const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

// Signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: "Email already in use" });

    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.json({ user: { id: user._id, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ error: "Invalid credentials" });

    const token = createToken(user._id);
    res.json({ user: { id: user._id, email: user.email }, token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
