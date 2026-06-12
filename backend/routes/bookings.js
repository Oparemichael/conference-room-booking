{/* BOOKINGS.JS - Handles all booking-related API routes */}
const express = require("express");
const router = express.Router();
const pool = require("../database/db");

/* =========================
   CREATE BOOKING (POST)
========================= */
router.post("/", async (req, res) => {
  try {
    const {
      room_id,
      meeting_title,
      full_name,
      email,
      purpose,
      start_time,
      end_time,
    } = req.body;

    // -------------------------
    // VALIDATION: WEEKDAYS
    // -------------------------
    const day = new Date(start_time).getDay();
    const start = new Date(start_time);
    const end = new Date(end_time);

    const startHour = start.getHours();
    const endHour = end.getHours();

    if (day === 0 || day === 6) {
      return res.status(400).json({
        message: "Bookings are only allowed Monday to Friday.",
      });
    }

    if (startHour < 6 || endHour > 18) {
      return res.status(400).json({
        message: "Bookings are only allowed between 6 AM and 6 PM.",
      });
    }

    // -------------------------
    // CONFLICT CHECK
    // -------------------------
    const existingBooking = await pool.query(
      `
      SELECT *
      FROM bookings
      WHERE room_id = $1
      AND ($2 < end_time AND $3 > start_time)
      `,
      [room_id, start_time, end_time]
    );

    if (existingBooking.rows.length > 0) {
      return res.status(400).json({
        message: "This room is already booked for that time.",
      });
    }

    // -------------------------
    // INSERT BOOKING
    // -------------------------
    const result = await pool.query(
      `
      INSERT INTO bookings
      (
        room_id,
        meeting_title,
        full_name,
        email,
        purpose,
        start_time,
        end_time
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        room_id,
        meeting_title,
        full_name,
        email,
        purpose,
        start_time,
        end_time,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   GET ALL BOOKINGS
========================= */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM bookings ORDER BY start_time ASC"
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching bookings",
    });
  }
});

/* =========================
   UPDATE BOOKING (PUT)
========================= */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      room_id,
      meeting_title,
      full_name,
      email,
      purpose,
      start_time,
      end_time,
    } = req.body;

    // -------------------------
    // VALIDATION: WEEKDAYS + HOURS
    // -------------------------
    const day = new Date(start_time).getDay();
    const start = new Date(start_time);
    const end = new Date(end_time);

    const startHour = start.getHours();
    const endHour = end.getHours();

    if (day === 0 || day === 6) {
      return res.status(400).json({
        message: "Bookings are only allowed Monday to Friday.",
      });
    }

    if (startHour < 6 || endHour > 18) {
      return res.status(400).json({
        message: "Bookings are only allowed between 6 AM and 6 PM.",
      });
    }

    // -------------------------
    // CONFLICT CHECK (EXCLUDE SELF)
    // -------------------------
    const conflict = await pool.query(
      `
      SELECT *
      FROM bookings
      WHERE room_id = $1
      AND id != $2
      AND ($3 < end_time AND $4 > start_time)
      `,
      [room_id, id, start_time, end_time]
    );

    if (conflict.rows.length > 0) {
      return res.status(400).json({
        message: "This room is already booked for that time.",
      });
    }

    // -------------------------
    // UPDATE BOOKING
    // -------------------------
    const result = await pool.query(
      `
      UPDATE bookings
      SET
        room_id = $1,
        meeting_title = $2,
        full_name = $3,
        email = $4,
        purpose = $5,
        start_time = $6,
        end_time = $7
      WHERE id = $8
      RETURNING *
      `,
      [
        room_id,
        meeting_title,
        full_name,
        email,
        purpose,
        start_time,
        end_time,
        id,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({
      message: "Error updating booking",
    });
  }
});

/* =========================
   DELETE BOOKING
========================= */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM bookings
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error deleting booking",
    });
  }
});

module.exports = router;