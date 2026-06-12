/* ADMIN.jsx - CLEAN PRODUCTION VERSION */

import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

function Admin() {
  // 📅 Calendar events
  const [events, setEvents] = useState([]);

  // 🏢 Rooms from database
  const [rooms, setRooms] = useState([]);

  // 📋 Selected booking modal
  const [selectedEvent, setSelectedEvent] = useState(null);

  // 🔄 Refresh trigger
  const [refreshKey, setRefreshKey] = useState(0);

  // ⏳ Loading state
  const [loading, setLoading] = useState(true);

  // 🔍 Get room by ID helper
  const getRoomById = (roomId) => {
    return rooms.find(
      (room) => Number(room.id) === Number(roomId)
    );
  };

  // 📥 Fetch rooms + bookings together
  const fetchData = async () => {
    try {
      setLoading(true);

      const [roomsRes, bookingsRes] = await Promise.all([
        fetch("http://localhost:5000/api/rooms"),
        fetch("http://localhost:5000/api/bookings"),
      ]);

      const roomsData = await roomsRes.json();
      const bookingsData = await bookingsRes.json();

      setRooms(roomsData);

      // 🧠 Create fast lookup map for rooms
      const roomMap = {};
      roomsData.forEach((room) => {
        roomMap[room.id] = room;
      });

      // 📅 Format bookings for FullCalendar
      const formattedEvents = bookingsData.map((b) => ({
        id: b.id,
        title: b.meeting_title,

        start: b.start_time,
        end: b.end_time,

        // 🎨 Dynamic room colors
        backgroundColor:
          roomMap[b.room_id]?.color || "#6366F1",

        borderColor:
          roomMap[b.room_id]?.color || "#6366F1",

        extendedProps: {
          room_id: b.room_id,
          full_name: b.full_name,
          email: b.email,
          purpose: b.purpose,
        },
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 📡 Load data on mount + refresh
  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  // 🗑 Delete booking
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

      // 🔄 Refresh everything (clean approach)
      setRefreshKey((prev) => prev + 1);

      setSelectedEvent(null);

      alert("Booking deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Error deleting booking");
    }
  };

  // ⏳ Loading UI
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 🟦 HEADER */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Dashboard
            </h1>
            <p className="text-gray-600 text-sm">
              All room bookings in one view
            </p>
          </div>

          <div className="flex gap-6 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600">
              Home
            </a>
            <a href="/admin-rooms" className="hover:text-blue-600">
              Edit Rooms
            </a>
          </div>

        </div>
      </div>

      {/* 📅 CALENDAR AREA */}
      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* 🟢 ROOM LEGEND */}
        <div className="flex flex-wrap gap-4 mb-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="flex items-center gap-2"
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor:
                    room.color || "#6366F1",
                }}
              />

              <span className="text-sm text-gray-700">
                {room.name}
              </span>
            </div>
          ))}
        </div>

        {/* 📅 FULLCALENDAR */}
        <div className="bg-white border rounded-xl p-4 shadow-sm">

          <FullCalendar
            height="750px"
            plugins={[
              timeGridPlugin,
              dayGridPlugin,
              interactionPlugin,
            ]}
            initialView="timeGridWeek"

            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right:
                "timeGridWeek,timeGridDay,dayGridMonth",
            }}

            slotMinTime="06:00:00"
            slotMaxTime="18:00:00"
            allDaySlot={false}
            nowIndicator={true}

            events={events}

            // 🟢 CLICK EVENT (OPEN MODAL)
            eventClick={(info) => {
              setSelectedEvent({
                id: info.event.id,

                title: info.event.title,

                room:
                  getRoomById(
                    info.event.extendedProps.room_id
                  )?.name || "Unknown Room",

                full_name:
                  info.event.extendedProps.full_name,

                email:
                  info.event.extendedProps.email,

                purpose:
                  info.event.extendedProps.purpose,

                start:
                  info.event.start?.toLocaleString(),

                end:
                  info.event.end?.toLocaleString(),
              });
            }}

            // 🟢 TOOLTIP
            eventMouseEnter={(info) => {
              info.el.title =
                `${info.event.title}\n` +
                `Room: ${info.event.extendedProps.room_id}\n` +
                `By: ${info.event.extendedProps.full_name}`;
            }}

            // 🎨 CLEAN UI STYLE
            eventDidMount={(info) => {
              info.el.style.borderRadius = "6px";
              info.el.style.fontSize = "12px";
              info.el.style.padding = "2px";
            }}
          />

          {/* 🟢 MODAL */}
          {selectedEvent && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

              <div className="bg-white rounded-xl p-6 w-[450px] shadow-lg">

                <h2 className="text-xl font-bold mb-4">
                  {selectedEvent.title}
                </h2>

                <div className="space-y-2 text-sm">

                  <p>
                    <strong>Room:</strong>{" "}
                    {selectedEvent.room}
                  </p>

                  <p>
                    <strong>Booked By:</strong>{" "}
                    {selectedEvent.full_name}
                  </p>

                  <p>
                    <strong>Email:</strong>{" "}
                    {selectedEvent.email}
                  </p>

                  <p>
                    <strong>Purpose:</strong>{" "}
                    {selectedEvent.purpose}
                  </p>

                  <p>
                    <strong>Start:</strong>{" "}
                    {selectedEvent.start}
                  </p>

                  <p>
                    <strong>End:</strong>{" "}
                    {selectedEvent.end}
                  </p>

                </div>

                {/* 🟢 ACTIONS */}
                <div className="mt-6 flex justify-end gap-3">

                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    onClick={() =>
                      handleDeleteBooking(selectedEvent.id)
                    }
                  >
                    Delete
                  </button>

                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    onClick={() =>
                      setSelectedEvent(null)
                    }
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