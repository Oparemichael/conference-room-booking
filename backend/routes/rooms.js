const express = require("express");
const router = express.Router();
const pool = require("../database/db");
const { requireAdmin } = require("./auth");

pool
  .query("ALTER TABLE rooms ADD COLUMN IF NOT EXISTS image_url TEXT")
  .catch((err) => {
    console.error("ROOM SCHEMA UPDATE ERROR:", err);
  });

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM rooms ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("ROOM FETCH ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch rooms",
    });
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const { name, location, capacity, color, image_url } = req.body;

    if (!name || !location || !capacity) {
      return res.status(400).json({
        message: "Name, location and capacity are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO rooms (name, location, capacity, color, image_url)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [name, location, capacity, color || "#4285F4", image_url || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("ROOM CREATE ERROR:", err);
    res.status(500).json({
      message: "Failed to create room",
    });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, capacity, color, image_url } = req.body;

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
        color = $4,
        image_url = $5
      WHERE id = $6
      RETURNING *
      `,
      [name, location, capacity, color, image_url || null, id]
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

router.delete("/:id", requireAdmin, async (req, res) => {
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

module.exports = router;
