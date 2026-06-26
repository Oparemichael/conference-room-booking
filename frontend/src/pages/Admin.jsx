/* ADMIN.jsx - CLEAN + COMMENTED VERSION */

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const DEFAULT_ROOM_COLOR = "#6366F1";

const getReadableTextColor = (backgroundColor) => {
  const hex = backgroundColor.replace("#", "");

  if (hex.length !== 6) return "#ffffff";

  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return brightness > 150 ? "#111827" : "#ffffff";
};

const getStatusColor = (status) => {
  if (status === "approved") return "#22c55e";
  if (status === "rejected") return "#ef4444";
  return "#f59e0b";
};

function Admin() {

  /* =========================
     STATE MANAGEMENT
  ========================= */

  // Stores calendar events (formatted bookings)
  const [events, setEvents] = useState([]);

  // Stores all rooms from database
  const [rooms, setRooms] = useState([]);

  // Stores selected booking for modal popup
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Controls refresh of data (forces re-fetch)
  const [refreshKey, setRefreshKey] = useState(0);

  // Loading state for UI feedback
  const [loading, setLoading] = useState(true);


  /* =========================
     ROOM LOOKUP MAP
     (faster than .find every time)
  ========================= */
  const roomMap = Object.fromEntries(
    rooms.map((room) => [room.id, room])
  );


  /* =========================
     FETCH ROOMS + BOOKINGS
     FROM BACKEND (POSTGRESQL)
  ========================= */
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch rooms and bookings in parallel
      const [roomsRes, bookingsRes] = await Promise.all([
        fetch("http://localhost:5000/api/rooms"),
        fetch("http://localhost:5000/api/bookings"),
      ]);

      const roomsData = await roomsRes.json();
      const bookingsData = await bookingsRes.json();

      // Save rooms in state
      setRooms(roomsData);

      const roomsById = Object.fromEntries(
        roomsData.map((room) => [Number(room.id), room])
      );

      /* =========================
         FORMAT BOOKINGS FOR CALENDAR
         (FullCalendar format)
      ========================= */
      const formattedEvents = bookingsData.map((b) => {
        const room = roomsById[Number(b.room_id)];
        const roomColor = room?.color || DEFAULT_ROOM_COLOR;

        return {
          id: b.id,
          title: b.meeting_title,

          // Event time range
          start: b.start_time,
          end: b.end_time,

          // Room color is the main calendar background color.
          backgroundColor: roomColor,
          borderColor: roomColor,
          textColor: getReadableTextColor(roomColor),

          // Extra data stored for modal usage
          extendedProps: {
            room_id: b.room_id,
            room_name: room?.name || "Unknown Room",
            room_color: roomColor,
            status: b.status || "pending",
            full_name: b.full_name,
            email: b.email,
            purpose: b.purpose,
          },
        };
      });

      // Save events for calendar
      setEvents(formattedEvents);

    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  };


  /* =========================
     LOAD DATA ON PAGE LOAD
     + WHEN REFRESH KEY CHANGES
  ========================= */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [refreshKey]);


  /* =========================
     DELETE BOOKING
  ========================= */
  const handleDeleteBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Refresh calendar after deletion
      setRefreshKey((prev) => prev + 1);

      // Close modal
      setSelectedEvent(null);

      alert("Booking deleted successfully");

    } catch (error) {
      console.error(error);
      alert("Error deleting booking");
    }
  };


  /* =========================
     LOADING SCREEN
  ========================= */
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-600">
        Loading dashboard...
      </div>
    );
  }


  /* =========================
     UI RENDER
  ========================= */
  return (
    <div className="app-shell">

      {/* =========================
         HEADER SECTION
      ========================= */}
      <div className="app-nav">
        <div className="app-container flex items-center justify-between py-5">

          {/* Title */}
          <div>
            <h1 className="text-2xl font-black text-slate-950">
              Admin Dashboard
            </h1>
            <p className="text-slate-500 text-sm">
              All room bookings in one view
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-2 text-sm font-medium">
            <a href="/" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-blue-700">
              Home
            </a>
            <a href="/admin-rooms" className="app-button-secondary">
              Edit Rooms
            </a>
          </div>

        </div>
      </div>


      {/* =========================
         MAIN CONTENT AREA
      ========================= */}
      <div className="app-container py-6">

        {/* =========================
           ROOM LEGEND (COLORS)
        ========================= */}
        <div className="flex flex-wrap gap-4 mb-4">
          {rooms.map((room) => (
            <div key={room.id} className="flex items-center gap-2">

              {/* Color indicator */}
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor: room.color || "#6366F1",
                }}
              />

              {/* Room name */}
              <span className="text-sm font-medium text-slate-700">
                {room.name}
              </span>
            </div>
          ))}
        </div>


        {/* =========================
           FULL CALENDAR SECTION
        ========================= */}
        <div className="app-card calendar-surface p-5">

          <FullCalendar

            /* Calendar size */
            height="750px"

            /* Plugins used */
            plugins={[
              timeGridPlugin,
              dayGridPlugin,
              interactionPlugin,
            ]}

            /* Default view */
            initialView="timeGridWeek"

            /* Header controls */
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridWeek,timeGridDay,dayGridMonth",
            }}

            /* Time range shown */
            slotMinTime="06:00:00"
            slotMaxTime="18:00:00"
            allDaySlot={false}
            nowIndicator={true}

            /* Calendar events */
            events={events}


            /* =========================
               CLICK EVENT (OPEN MODAL)
            ========================= */
            eventClick={(info) => {
              setSelectedEvent({
                id: info.event.id,
                title: info.event.title,
                room:
                  info.event.extendedProps.room_name ||
                  roomMap[info.event.extendedProps.room_id]?.name ||
                  "Unknown Room",
                full_name: info.event.extendedProps.full_name,
                email: info.event.extendedProps.email,
                purpose: info.event.extendedProps.purpose,
                status: info.event.extendedProps.status,
                start: info.event.start?.toLocaleString(),
                end: info.event.end?.toLocaleString(),
              });
            }}


            /* =========================
               HOVER TOOLTIP
            ========================= */
            eventMouseEnter={(info) => {
              info.el.title =
                `${info.event.title}\n` +
                `Room: ${info.event.extendedProps.room_name}\n` +
                `By: ${info.event.extendedProps.full_name}`;
            }}


            /* =========================
               EVENT STYLING
            ========================= */
            eventDidMount={(info) => {
              const statusColor = getStatusColor(info.event.extendedProps.status);

              info.el.style.borderRadius = "6px";
              info.el.style.fontSize = "12px";
              info.el.style.padding = "2px";
              info.el.style.boxShadow = `inset 4px 0 0 ${statusColor}`;
            }}

          />


          {/* =========================
             EVENT DETAILS MODAL
          ========================= */}
          {selectedEvent && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

              <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">

                {/* Title */}
                <h2 className="mb-4 text-xl font-bold text-slate-950">
                  {selectedEvent.title}
                </h2>

                {/* Details */}
                <div className="space-y-2 text-sm">

                  <p><strong>Room:</strong> {selectedEvent.room}</p>
                  <p><strong>Booked By:</strong> {selectedEvent.full_name}</p>
                  <p><strong>Email:</strong> {selectedEvent.email}</p>
                  <p><strong>Purpose:</strong> {selectedEvent.purpose}</p>
                  <p><strong>Start:</strong> {selectedEvent.start}</p>
                  <p><strong>End:</strong> {selectedEvent.end}</p>

                </div>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      selectedEvent.status === "approved"
                        ? "text-green-600"
                        : selectedEvent.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }
                  >
                    {selectedEvent.status}
                  </span>
                </p>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-3">

                  <button
                    className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                    onClick={() =>
                      handleDeleteBooking(selectedEvent.id)
                    }
                  >
                    Delete
                  </button>

                  <button
                    className="app-button-primary"
                    onClick={() => setSelectedEvent(null)}
                  >
                    Close
                  </button>

                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Admin;
