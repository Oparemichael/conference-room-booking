import { useEffect, useMemo, useState } from "react";
import AppNav from "../components/AppNav";

const ROOM_IMAGE_CATALOG = [
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=900&q=80",
];

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [capacityFilter, setCapacityFilter] = useState("All");
  const [equipmentFilter, setEquipmentFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetch("http://localhost:5000/api/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error(err));
  }, []);

  const parseEquipmentTags = (room) => {
    const rawTags = room.equipment_tags || room.tags || room.equipment || [];

    if (Array.isArray(rawTags)) return rawTags;
    if (typeof rawTags === "string") {
      return rawTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }
    return [];
  };

  const getRoomImage = (room, fallbackIndex = 0) => {
    if (typeof room.image_url === "string" && room.image_url.trim()) {
      return room.image_url;
    }

    const index = (Number(room.id) + fallbackIndex) % ROOM_IMAGE_CATALOG.length;
    return ROOM_IMAGE_CATALOG[index];
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const nameMatches = room.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const status = room.status || (room.available === false ? "Booked" : "Available");
      const statusMatches = statusFilter === "All" || status === statusFilter;

      const capacityMatches =
        capacityFilter === "All" ||
        (capacityFilter === "Small" && Number(room.capacity) <= 8) ||
        (capacityFilter === "Medium" && Number(room.capacity) > 8 && Number(room.capacity) <= 16) ||
        (capacityFilter === "Large" && Number(room.capacity) > 16);

      const tags = parseEquipmentTags(room);
      const equipmentMatches = equipmentFilter === "All" || tags.includes(equipmentFilter);

      return nameMatches && statusMatches && capacityMatches && equipmentMatches;
    });
  }, [rooms, searchTerm, statusFilter, capacityFilter, equipmentFilter]);

  return (
    <div className="app-shell min-h-screen">
      <AppNav />

      <main className="app-container py-8 lg:py-10">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4 rounded-[28px] border border-slate-200 bg-white/80 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Meeting spaces</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">Reserve the right room with ease</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">Discover polished meeting rooms, compare features, and secure a slot in seconds.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">Share</button>
            <button className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">+ New room</button>
            <div className="ml-1 flex rounded-full border border-slate-200 bg-slate-50 p-1">
              <button type="button" onClick={() => setViewMode("grid")} className={`rounded-full px-3 py-2 text-sm font-semibold ${viewMode === "grid" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}>⊞</button>
              <button type="button" onClick={() => setViewMode("list")} className={`rounded-full px-3 py-2 text-sm font-semibold ${viewMode === "list" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"}`}>☰</button>
            </div>
          </div>
        </header>

        <section className="mb-6 rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
          <div className="grid gap-3 md:grid-cols-4">
            <label className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">
              <span className="mb-2 block font-semibold text-slate-600">Room name</span>
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search rooms" className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none" />
            </label>

            <label className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">
              <span className="mb-2 block font-semibold text-slate-600">Status</span>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none">
                <option value="All">All</option>
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
              </select>
            </label>

            <label className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">
              <span className="mb-2 block font-semibold text-slate-600">Capacity</span>
              <select value={capacityFilter} onChange={(e) => setCapacityFilter(e.target.value)} className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none">
                <option value="All">All</option>
                <option value="Small">Up to 8</option>
                <option value="Medium">8 to 16</option>
                <option value="Large">16+</option>
              </select>
            </label>

            <label className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">
              <span className="mb-2 block font-semibold text-slate-600">Equipment</span>
              <select value={equipmentFilter} onChange={(e) => setEquipmentFilter(e.target.value)} className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none">
                <option value="All">All tags</option>
                <option value="Video">Video</option>
                <option value="Whiteboard">Whiteboard</option>
                <option value="Projector">Projector</option>
                <option value="Phone">Phone</option>
              </select>
            </label>
          </div>
        </section>

        <section className={viewMode === "grid" ? "grid gap-5 md:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>
          {filteredRooms.map((room) => {
            const status = room.status || (room.available === false ? "Booked" : "Available");
            const tags = parseEquipmentTags(room);
            const rate = room.hourly_rate || room.rate || 35;

            return (
              <article key={room.id} className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  <img src={imageErrors[room.id] ? getRoomImage(room, 1) : getRoomImage(room)} alt={room.name} className="h-full w-full object-cover object-center" loading="lazy" onError={() => setImageErrors((prev) => ({ ...prev, [room.id]: true }))} />
                  <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${status === "Available" ? "bg-emerald-500/90 text-white" : "bg-amber-500/90 text-white"}`}>{status}</span>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-slate-950">{room.name}</h2>
                      <p className="mt-1 text-sm text-slate-500">{room.location}</p>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">{room.capacity} seats</span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">{tag}</span>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">From</p>
                      <p className="text-lg font-black text-slate-950">${rate}</p>
                    </div>
                    <a href={`/room/${room.id}`} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">Reserve Slot</a>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}

export default Rooms;
