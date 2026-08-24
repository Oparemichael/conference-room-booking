import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getAdminHeaders } from "../utils/auth";

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
  const [events, setEvents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  const roomMap = Object.fromEntries(rooms.map((room) => [room.id, room]));

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

      const roomsById = Object.fromEntries(roomsData.map((room) => [Number(room.id), room]));

      const formattedEvents = bookingsData.map((b) => {
        const room = roomsById[Number(b.room_id)];
        const roomColor = room?.color || DEFAULT_ROOM_COLOR;

        return {
          id: b.id,
          title: b.meeting_title,
          start: b.start_time,
          end: b.end_time,
          backgroundColor: roomColor,
          borderColor: roomColor,
          textColor: getReadableTextColor(roomColor),
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

      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [refreshKey]);

  const handleDeleteBooking = async (bookingId) => {
    const confirmed = window.confirm("Are you sure you want to delete this booking?");
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setRefreshKey((prev) => prev + 1);
      setSelectedEvent(null);
      alert("Booking deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Error deleting booking");
    }
  };

  if (loading) {
    return <div className="app-card p-6 text-slate-600">Loading dashboard...</div>;
  }

  return (
    <div>
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Admin dashboard
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Booking Operations
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            All room bookings in one color-coded calendar view.
          </p>
        </div>
        <div className="mb-6 flex flex-wrap gap-3">
          {rooms.map((room) => (
            <div key={room.id} className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: room.color || "#6366F1" }} />
              <span className="text-sm font-medium text-slate-700">{room.name}</span>
            </div>
          ))}
        </div>

        <div className="material-panel calendar-surface p-5">
          <FullCalendar
            height="750px"
            plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "timeGridWeek,timeGridDay,dayGridMonth",
            }}
            slotMinTime="06:00:00"
            slotMaxTime="18:00:00"
            allDaySlot={false}
            nowIndicator={true}
            events={events}
            eventClick={(info) => {
              setSelectedEvent({
                id: info.event.id,
                title: info.event.title,
                room: info.event.extendedProps.room_name || roomMap[info.event.extendedProps.room_id]?.name || "Unknown Room",
                full_name: info.event.extendedProps.full_name,
                email: info.event.extendedProps.email,
                purpose: info.event.extendedProps.purpose,
                status: info.event.extendedProps.status,
                start: info.event.start?.toLocaleString(),
                end: info.event.end?.toLocaleString(),
              });
            }}
            eventMouseEnter={(info) => {
              info.el.title = `${info.event.title}\nRoom: ${info.event.extendedProps.room_name}\nBy: ${info.event.extendedProps.full_name}`;
            }}
            eventDidMount={(info) => {
              const statusColor = getStatusColor(info.event.extendedProps.status);
              info.el.style.borderRadius = "8px";
              info.el.style.fontSize = "12px";
              info.el.style.padding = "2px";
              info.el.style.boxShadow = `inset 4px 0 0 ${statusColor}`;
            }}
          />

          {selectedEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
              <div className="w-full max-w-md rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_25px_50px_rgba(15,23,42,0.22)]">
                <h2 className="mb-4 text-xl font-bold text-slate-950">{selectedEvent.title}</h2>

                <div className="space-y-2 text-sm text-slate-600">
                  <p><strong className="text-slate-800">Room:</strong> {selectedEvent.room}</p>
                  <p><strong className="text-slate-800">Booked By:</strong> {selectedEvent.full_name}</p>
                  <p><strong className="text-slate-800">Email:</strong> {selectedEvent.email}</p>
                  <p><strong className="text-slate-800">Purpose:</strong> {selectedEvent.purpose}</p>
                  <p><strong className="text-slate-800">Start:</strong> {selectedEvent.start}</p>
                  <p><strong className="text-slate-800">End:</strong> {selectedEvent.end}</p>
                </div>

                <p className="mt-4 text-sm">
                  <strong className="text-slate-800">Status:</strong>{" "}
                  <span className={selectedEvent.status === "approved" ? "text-green-600" : selectedEvent.status === "rejected" ? "text-red-600" : "text-yellow-600"}>{selectedEvent.status}</span>
                </p>

                <div className="mt-6 flex justify-end gap-3">
                  <button className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700" onClick={() => handleDeleteBooking(selectedEvent.id)}>Delete</button>
                  <button className="app-button-primary" onClick={() => setSelectedEvent(null)}>Close</button>
                </div>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}

export default Admin;
