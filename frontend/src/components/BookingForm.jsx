// 🟢 IMPORTS
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function BookingForm({
  roomId,
  selectedSlot,
  onBookingSuccess,
}) {
  // 🟡 UI MESSAGE STATE
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");

  // 🟢 SINGLE SOURCE OF TRUTH FOR FORM DATA (FIXED — ONLY ONE STATE)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    meeting_title: "",
    purpose: "",
    start_time: null, // Date object
    end_time: null,   // Date object
  });

  // 🟢 SHOW MESSAGE HELPER
  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage(null);
      setMessageType("");
    }, 3000);
  };

  // 🟢 AUTO-FILL FROM CALENDAR SELECTION
  useEffect(() => {
    if (selectedSlot) {
      setFormData((prev) => ({
        ...prev,
        start_time: new Date(selectedSlot.start),
        end_time: new Date(selectedSlot.end),
      }));
    }
  }, [selectedSlot]);

  // 🟢 TEXT INPUT HANDLER
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🟢 SUBMIT BOOKING
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🟡 VALIDATION
    const start = new Date(formData.start_time);
    const end = new Date(formData.end_time);
    const now = new Date();

    if (start < now) {
      alert("You cannot create a booking in the past.");
      return;
    }

    if (end <= start) {
      alert("End time must be after start time.");
      return;
    }

    // 🟢 CLEAN PAYLOAD
    const booking = {
      room_id: roomId,
      meeting_title: formData.meeting_title,
      full_name: formData.full_name,
      email: formData.email,
      purpose: formData.purpose,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(booking),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || "Booking failed", "error");
        return;
      }

      showMessage("Booking created successfully!", "success");

      // 🟢 REFRESH CALENDAR
      if (onBookingSuccess) onBookingSuccess();

      // 🟢 RESET FORM
      setFormData({
        full_name: "",
        email: "",
        meeting_title: "",
        purpose: "",
        start_time: null,
        end_time: null,
      });

    } catch (error) {
      console.error(error);
      showMessage("Server error. Please try again.", "error");
    }
  };

  return (
    <>
      {/* 🟡 MESSAGE DISPLAY */}
      {message && (
        <div
          style={{
            padding: "12px",
            borderRadius: "10px",
            textAlign: "center",
            fontWeight: "500",
            marginBottom: "10px",
            background: messageType === "error" ? "#fee2e2" : "#dcfce7",
            color: messageType === "error" ? "#b91c1c" : "#166534",
            border: messageType === "error"
              ? "1px solid #fca5a5"
              : "1px solid #86efac",
          }}
        >
          {message}
        </div>
      )}

  <form
    onSubmit={handleSubmit}
    className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-4"
  >
    {/* Header */}
    <div className="text-center mb-2">
      <h2 className="text-xl font-semibold text-gray-800">
        Book Meeting Room
      </h2>
      <p className="text-sm text-gray-500">
        Fill in the details to reserve your slot
      </p>
    </div>

    {/* Inputs */}
    <input
      name="full_name"
      placeholder="Full Name"
      value={formData.full_name}
      onChange={handleChange}
      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />

    <input
      name="meeting_title"
      placeholder="Meeting Title"
      value={formData.meeting_title}
      onChange={handleChange}
      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />

    <input
      name="email"
      placeholder="Email"
      value={formData.email}
      onChange={handleChange}
      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />

    <input
      name="purpose"
      placeholder="Purpose"
      value={formData.purpose}
      onChange={handleChange}
      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />

    {/* Start Time */}
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-600">
        Start Time
      </label>
      <DatePicker
        selected={formData.start_time}
        onChange={(date) =>
          setFormData((prev) => ({ ...prev, start_time: date }))
        }
        showTimeSelect
        dateFormat="Pp"
        timeIntervals={15}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>

    {/* End Time */}
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-600">
        End Time
      </label>
      <DatePicker
        selected={formData.end_time}
        onChange={(date) =>
          setFormData((prev) => ({ ...prev, end_time: date }))
        }
        showTimeSelect
        dateFormat="Pp"
        timeIntervals={15}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-[0.99] transition"
    >
      Book Room
    </button>
  </form>
    </>
  );
}

export default BookingForm;