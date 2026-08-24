import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AppNav from "../components/AppNav";
import BookingForm from "../components/BookingForm";
import RoomCalendar from "../components/RoomCalendar";

function RoomDashboard() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [refreshCalendar, setRefreshCalendar] = useState(0);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    fetch("http://localhost:5000/api/rooms")
      .then((res) => res.json())
      .then((data) => {
        const selected = data.find((item) => Number(item.id) === Number(id));
        setRoom(selected || null);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="app-card p-6 text-slate-600">Loading room...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="app-card p-6 text-slate-600">Room not found.</div>
      </div>
    );
  }

  const amenities = room.amenities
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="app-shell">
      <AppNav />

      <main className="app-container py-8">
        <section className="app-card mb-6 overflow-hidden">
          {room.image_url && (
            <img src={room.image_url} alt={room.name} className="h-56 w-full object-cover" />
          )}
          <div className="h-2" style={{ backgroundColor: room.color || "#2563eb" }} />
          <div className="flex flex-wrap items-end justify-between gap-4 p-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Room details</p>
              <h1 className="mt-2 text-3xl font-black text-slate-950">{room.name}</h1>
              <p className="mt-2 text-slate-600">{room.location} • Capacity {room.capacity}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(amenities?.length ? amenities : ["Workspace", "Hybrid-ready"]).map((amenity) => (
                <span key={amenity} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <section className="material-panel p-5">
            <RoomCalendar roomId={room.id} roomColor={room.color} onSelect={setSelectedSlot} refreshCalendar={refreshCalendar} />
          </section>

          <aside className="material-panel h-fit p-6 xl:sticky xl:top-6">
            <BookingForm roomId={room.id} selectedSlot={selectedSlot} onBookingSuccess={() => setRefreshCalendar((prev) => prev + 1)} />
          </aside>
        </div>
      </main>
    </div>
  );
}

export default RoomDashboard;
