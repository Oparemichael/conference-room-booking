/* ROOMS.JS - Handles all room-related API routes */

const express = require("express");
const router = express.Router();
const pool = require("../database/db");


// ===============================
// 📥 GET ALL ROOMS
// ===============================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM rooms ORDER BY id ASC"
    );

    // ✅ Always return JSON
    res.json(result.rows);

  } catch (err) {
    console.error("ROOM FETCH ERROR:", err);

    // 🔴 ALWAYS return JSON error (prevents <!DOCTYPE html> crash)
    res.status(500).json({
      message: "Failed to fetch rooms",
    });
  }
});


// ===============================
// ➕ CREATE ROOM
// ===============================
router.post("/", async (req, res) => {
  try {
    const {
      name,
      location,
      capacity,
      color, // 🆕 IMPORTANT (for calendar UI)
    } = req.body;

    // 🟡 BASIC VALIDATION
    if (!name || !location || !capacity) {
      return res.status(400).json({
        message: "Name, location and capacity are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO rooms (name, location, capacity, color)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [name, location, capacity, color || "#4285F4"]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("ROOM CREATE ERROR:", err);

    res.status(500).json({
      message: "Failed to create room",
    });
  }
});


// ===============================
// ✏️ UPDATE ROOM
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      location,
      capacity,
      color,
    } = req.body;

    // 🟡 VALIDATION
    if (!name || !location || !capacity) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const result = await pool.query(
      `
      UPDATE rooms
      SET
        name = $1,
        location = $2,
        capacity = $3,
        color = $4
      WHERE id = $5
      RETURNING *
      `,
      [name, location, capacity, color, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("ROOM UPDATE ERROR:", err);

    res.status(500).json({
      message: "Failed to update room",
    });
  }
});


// ===============================
// 🗑 DELETE ROOM
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM rooms
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.json({
      message: "Room deleted successfully",
    });

  } catch (err) {
    console.error("ROOM DELETE ERROR:", err);

    res.status(500).json({
      message: "Failed to delete room",
    });
  }
});


// ===============================
module.exports = router;