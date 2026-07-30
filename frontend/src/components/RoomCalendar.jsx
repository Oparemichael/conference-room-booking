import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import BookingForm from "../components/BookingForm";

const DEFAULT_ROOM_COLOR = "#2563eb";

function RoomCalendar({ roomId, roomColor = DEFAULT_ROOM_COLOR, refreshCalendar, refreshKey }) {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [slot, setSlot] = useState(null);
  const [localRefreshKey, setLocalRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/bookings");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load bookings");
        }

        const formatted = data
          .filter((booking) => Number(booking.room_id) === Number(roomId))
          .map((booking) => ({
            id: booking.id,
            title: booking.meeting_title,
            start: booking.start_time,
            end: booking.end_time,
            backgroundColor: roomColor,
            borderColor: roomColor,
            extendedProps: {
              full_name: booking.full_name,
              email: booking.email,
              purpose: booking.purpose,
              status: booking.status || "pending",
            },
          }));

        setEvents(formatted);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [roomId, roomColor, localRefreshKey, refreshCalendar, refreshKey]);

  return (
    <div className="calendar-surface">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Room Schedule</h2>
          <p className="text-sm text-slate-500">
            Select an open weekday time slot to create a booking.
          </p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          6 AM - 6 PM
        </div>
      </div>

      {loading && (
        <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
          Loading room schedule...
        </div>
      )}

      <FullCalendar
        height="720px"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
        slotMinTime="06:00:00"
        slotMaxTime="18:00:00"
        hiddenDays={[0, 6]}
        nowIndicator={true}
        allDaySlot={false}
        events={events}
        selectable={true}
        selectMirror={true}
        selectAllow={(selectInfo) => {
          const day = selectInfo.start.getDay();
          const startHour = selectInfo.start.getHours();
          const endHour = selectInfo.end.getHours();

          return day >= 1 && day <= 5 && startHour >= 6 && endHour <= 18;
        }}
        select={(info) => {
          setSlot({
            start: info.startStr,
            end: info.endStr,
          });
          setShowBookingModal(true);
        }}
        eventClick={(info) => {
          setSelectedEvent({
            title: info.event.title,
            full_name: info.event.extendedProps.full_name,
            email: info.event.extendedProps.email,
            purpose: info.event.extendedProps.purpose,
            status: info.event.extendedProps.status,
            start: info.event.start?.toLocaleString(),
            end: info.event.end?.toLocaleString(),
          });
        }}
        eventMouseEnter={(info) => {
          info.el.title = `${info.event.title}\n${info.event.extendedProps.full_name}`;
        }}
        eventDidMount={(info) => {
          info.el.style.borderRadius = "8px";
          info.el.style.fontSize = "12px";
          info.el.style.fontWeight = "700";
          info.el.style.padding = "2px";
        }}
      />

      {showBookingModal && slot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="material-panel max-h-[92vh] w-full max-w-lg overflow-y-auto p-6">
            <BookingForm
              roomId={roomId}
              selectedSlot={slot}
              onBookingSuccess={() => {
                setShowBookingModal(false);
                setSlot(null);
                setLocalRefreshKey((prev) => prev + 1);
              }}
            />

            <button
              className="mt-3 w-full rounded-lg border border-slate-200 bg-white py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              onClick={() => {
                setShowBookingModal(false);
                setSlot(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="material-panel w-full max-w-md p-6">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-950">{selectedEvent.title}</h2>
              <p className="mt-1 text-sm text-slate-500">Booking details</p>
            </div>

            <div className="space-y-3 text-sm">
              <p><strong className="text-slate-700">Booked By:</strong> {selectedEvent.full_name}</p>
              <p><strong className="text-slate-700">Email:</strong> {selectedEvent.email}</p>
              <p><strong className="text-slate-700">Purpose:</strong> {selectedEvent.purpose || "Not provided"}</p>
              <p><strong className="text-slate-700">Start:</strong> {selectedEvent.start}</p>
              <p><strong className="text-slate-700">End:</strong> {selectedEvent.end}</p>
              <p>
                <strong className="text-slate-700">Status:</strong>{" "}
                <span className="status-pill bg-amber-50 text-amber-700">
                  {selectedEvent.status || "pending"}
                </span>
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="app-button-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomCalendar;
