import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function BookingForm({ roomId, selectedSlot, onBookingSuccess }) {
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    meeting_title: "",
    purpose: "",
    start_time: null,
    end_time: null,
  });

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage(null);
      setMessageType("");
    }, 3000);
  };

  useEffect(() => {
    if (!selectedSlot) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((prev) => ({
      ...prev,
      start_time: new Date(selectedSlot.start),
      end_time: new Date(selectedSlot.end),
    }));
  }, [selectedSlot]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const start = new Date(formData.start_time);
    const end = new Date(formData.end_time);
    const now = new Date();

    if (start < now) {
      showMessage("You cannot create a booking in the past.", "error");
      return;
    }

    if (end <= start) {
      showMessage("End time must be after start time.", "error");
      return;
    }

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
      setIsSubmitting(true);

      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(booking),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || "Booking failed", "error");
        return;
      }

      showMessage("Booking created successfully.", "success");

      if (onBookingSuccess) onBookingSuccess();

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-950">Book This Room</h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose a weekday slot between 6 AM and 6 PM.
        </p>
      </div>

      {message && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm font-medium ${
            messageType === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {message}
        </div>
      )}

      <label className="app-label">
        Full Name
        <input
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          className="app-input mt-1"
          required
        />
      </label>

      <label className="app-label">
        Meeting Title
        <input
          name="meeting_title"
          value={formData.meeting_title}
          onChange={handleChange}
          className="app-input mt-1"
          required
        />
      </label>

      <label className="app-label">
        Email
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="app-input mt-1"
          required
        />
      </label>

      <label className="app-label">
        Purpose
        <input
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          className="app-input mt-1"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="app-label">
          Start Time
          <DatePicker
            selected={formData.start_time}
            onChange={(date) =>
              setFormData((prev) => ({ ...prev, start_time: date }))
            }
            showTimeSelect
            dateFormat="Pp"
            timeIntervals={15}
            className="app-input mt-1"
            required
          />
        </label>

        <label className="app-label">
          End Time
          <DatePicker
            selected={formData.end_time}
            onChange={(date) =>
              setFormData((prev) => ({ ...prev, end_time: date }))
            }
            showTimeSelect
            dateFormat="Pp"
            timeIntervals={15}
            className="app-input mt-1"
            required
          />
        </label>
      </div>

      <button type="submit" disabled={isSubmitting} className="app-button-primary w-full py-3">
        {isSubmitting ? "Booking..." : "Book Room"}
      </button>
    </form>
  );
}

export default BookingForm;
