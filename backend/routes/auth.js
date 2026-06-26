const crypto = require("crypto");
const express = require("express");
const { createToken, verifyToken } = require("../utils/authToken");

const router = express.Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

const safeCompare = (first, second) => {
  const firstBuffer = Buffer.from(first);
  const secondBuffer = Buffer.from(second);

  if (firstBuffer.length !== secondBuffer.length) return false;

  return crypto.timingSafeEqual(firstBuffer, secondBuffer);
};

const verifyPasswordHash = (password, storedValue) => {
  const [salt, storedHash] = storedValue.split(":");

  if (!salt || !storedHash) return false;

  const hash = crypto.scryptSync(password, salt, 64).toString("hex");

  return safeCompare(hash, storedHash);
};

const verifyPassword = (password) => {
  if (ADMIN_PASSWORD_HASH) {
    return verifyPasswordHash(password, ADMIN_PASSWORD_HASH);
  }

  return safeCompare(password, ADMIN_PASSWORD);
};

const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.replace("Bearer ", "")
    : null;

  const payload = verifyToken(token);

  if (!payload || payload.role !== "admin") {
    return res.status(401).json({
      message: "Admin authentication required",
    });
  }

  req.admin = payload;
  next();
};

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && verifyPassword(password || "")) {
    return res.json({
      message: "Login successful",
      token: createToken({
        role: "admin",
        username,
      }),
      user: {
        username,
        role: "admin",
      },
    });
  }

  return res.status(401).json({
    message: "Invalid credentials",
  });
});

router.get("/me", requireAdmin, (req, res) => {
  res.json({
    user: {
      username: req.admin.username,
      role: req.admin.role,
    },
  });
});

router.requireAdmin = requireAdmin;

module.exports = router;
