const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

const dotenv = require("dotenv");
dotenv.config();

// Example DB
const users = [
    { username: process.env.USER_1_USERNAME, password: process.env.USER_1_PASSWORD, role: process.env.USER_1_ROLE },
    { username: process.env.USER_2_USERNAME, password: process.env.USER_2_PASSWORD, role: process.env.USER_2_ROLE }
  ];

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware: Authentication
const auth = (req, res, next) => {
  const token = req.body.token;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied because no tokens were probided!" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token." });
  }
};

// Middleware: Role-Based Authorization
const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "Access denied. You do not have the required role." });
  }
  next();
};

// Route: Register
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  // Checking if user already exists
  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "User already exists." });
  }

  // Hash password and save user
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword, role });

  res.status(201).json({ message: "User registered successfully." });
});

// Route: Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password." });
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "1 day" }
  );
  res.json({ token });
});

// Student Access
router.get("/student", auth, authorize(["student"]), (req, res) => {
  res.json({ message: "Welcome, student!" });
});

// Admin Access
router.get("/admin", auth, authorize(["admin"]), (req, res) => {
  res.json({ message: "Welcome, admin!" });
});

module.exports = router;
