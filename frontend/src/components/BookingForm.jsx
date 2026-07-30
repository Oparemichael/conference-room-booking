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

  const hasSelectedTime = formData.start_time && formData.end_time;
  const timeSummary = hasSelectedTime
    ? `${formData.start_time.toLocaleString()} - ${formData.end_time.toLocaleString()}`
    : "Select a time on the calendar or choose one below.";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-2xl border border-white/70 bg-gradient-to-br from-blue-50/85 to-white/70 p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black text-white shadow-sm shadow-blue-600/30">
            +
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-950">Book This Room</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Fill in the meeting details and choose a weekday slot between 6 AM
              and 6 PM.
            </p>
          </div>
        </div>
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

      <div className="rounded-2xl border border-slate-200/70 bg-white/55 p-4 backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
          Selected time
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-800">{timeSummary}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="app-label">
          Full Name
          <input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Jane Doe"
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
            placeholder="jane@company.com"
            className="app-input mt-1"
            required
          />
        </label>
      </div>

      <label className="app-label">
        Meeting Title
        <input
          name="meeting_title"
          value={formData.meeting_title}
          onChange={handleChange}
          placeholder="Weekly planning"
          className="app-input mt-1"
          required
        />
      </label>

      <label className="app-label">
        Purpose
        <textarea
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          rows="3"
          placeholder="Add agenda, attendees, or setup notes"
          className="app-input mt-1 resize-none"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
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

      <button type="submit" disabled={isSubmitting} className="app-button-primary w-full py-3.5">
        {isSubmitting ? "Booking..." : "Book Room"}
      </button>
    </form>
  );
}

export default BookingForm;
