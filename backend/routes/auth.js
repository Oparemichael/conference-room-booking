const express = require("express");
const router = express.Router();

// temporary hardcoded admin (MVP)
const ADMIN = {
  username: "admin",
  password: "admin123",
};

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === ADMIN.username &&
    password === ADMIN.password
  ) {
    return res.json({
      message: "Login successful",
      token: "admin-token-123",
    });
  }

  return res.status(401).json({
    message: "Invalid credentials",
  });
});

module.exports = router;