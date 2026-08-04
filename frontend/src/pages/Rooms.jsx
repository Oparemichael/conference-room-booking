import { useEffect, useState } from "react";
import RoomCalendar from "../components/RoomCalendar";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/rooms")
      .then((response) => response.json())
      .then((data) => {
        setRooms(data);
        setSelectedRoom((current) => current || data[0] || null);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="app-shell">
      <nav className="app-nav">
        <div className="app-container flex items-center justify-between py-4">
          <a href="/" className="text-lg font-bold text-slate-950">
            Conference Room Booking
          </a>
          <div className="flex items-center gap-2 text-sm font-medium">
            <a href="/" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-blue-700">
              Home
            </a>
            <a href="/admin-login" className="app-button-secondary">
              Admin
            </a>
          </div>
        </div>
      </nav>
      <main className="app-container py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Room booking
            </p>
            <h1 className="mt-1 text-3xl font-black text-slate-950">Meeting Rooms</h1>
            <p className="mt-2 text-slate-600">
              Select a room, review its schedule, and reserve an open time slot.
            </p>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-3">
            {rooms.map((room) => (
              <button
                type="button"
                key={room.id}
                onClick={() => {
                  setSelectedRoom(room);
                  setRefreshKey((prev) => prev + 1);
                }}
                className={`app-card w-full p-4 text-left transition hover:border-blue-200 hover:shadow-md ${
                  selectedRoom?.id === room.id ? "border-blue-500 ring-2 ring-blue-100" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  {room.image_url ? (
                    <img
                      src={room.image_url}
                      alt={room.name}
                      className="h-16 w-20 rounded-xl object-cover"
                    />
                  ) : (
                    <div
                      className="mt-1 h-10 w-2 rounded-full"
                      style={{ backgroundColor: room.color || "#2563eb" }}
                    />
                  )}
                  <div className="min-w-0">
                    <h2 className="font-bold text-slate-950">{room.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">{room.location}</p>
                    <p className="mt-2 text-xs font-semibold text-slate-400">
                      Capacity {room.capacity}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </aside>
          <section className="app-card p-5">
            {!selectedRoom ? (
              <div className="flex min-h-[360px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500">
                Select a room to view its calendar.
              </div>
            ) : (
              <>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-4">
                    {selectedRoom.image_url && (
                      <img
                        src={selectedRoom.image_url}
                        alt={selectedRoom.name}
                        className="h-20 w-28 rounded-xl object-cover"
                      />
                    )}
                    <div>
                      <h2 className="text-2xl font-black text-slate-950">
                        {selectedRoom.name}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {selectedRoom.location} - Capacity {selectedRoom.capacity}
                      </p>
                    </div>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold text-white"
                    style={{ backgroundColor: selectedRoom.color || "#2563eb" }}
                  >
                    Room color
                  </span>
                </div>
                <RoomCalendar
                  roomId={selectedRoom.id}
                  roomColor={selectedRoom.color}
                  refreshKey={refreshKey}
                />
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Rooms;