import { useEffect, useState } from "react";
import { getAdminHeaders } from "../utils/auth";

const DEFAULT_ROOM_COLOR = "#2563eb";

function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    name: "",
    capacity: "",
    location: "",
    color: DEFAULT_ROOM_COLOR,
    image_url: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }, [refreshKey]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      capacity: "",
      location: "",
      color: DEFAULT_ROOM_COLOR,
      image_url: "",
    });
  };

  const createRoom = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/rooms", {
        method: "POST",
        headers: getAdminHeaders({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      alert(err.message);
    }
  };

  const startEdit = (room) => {
    setEditingId(room.id);
    setForm({
      name: room.name,
      capacity: room.capacity,
      location: room.location,
      color: room.color || DEFAULT_ROOM_COLOR,
      image_url: room.image_url || "",
    });
  };

  const updateRoom = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/rooms/${editingId}`, {
        method: "PUT",
        headers: getAdminHeaders({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      resetForm();
      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteRoom = async (id) => {
    if (!window.confirm("Delete this room?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/rooms/${id}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });

      if (!res.ok) throw new Error("Delete failed");

      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="app-shell">
      <nav className="app-nav">
        <div className="app-container flex items-center justify-between py-4">
          <a href="/admin" className="text-lg font-bold text-slate-950">
            Admin Rooms
          </a>
          <div className="flex items-center gap-2 text-sm font-medium">
            <a href="/admin" className="app-button-secondary">
              Dashboard
            </a>
            <a href="/" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-blue-700">
              Home
            </a>
          </div>
        </div>
      </nav>

      <main className="app-container grid gap-6 py-8 lg:grid-cols-[420px_1fr]">
        <section className="app-card h-fit p-6">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Room setup
            </p>
            <h1 className="mt-1 text-2xl font-black text-slate-950">
              {editingId ? "Edit Room" : "Create Room"}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Room colors are used directly in the admin and booking calendars.
            </p>
          </div>

          <div className="space-y-4">
            <label className="app-label">
              Room Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="app-input mt-1"
              />
            </label>

            <label className="app-label">
              Capacity
              <input
                name="capacity"
                type="number"
                value={form.capacity}
                onChange={handleChange}
                className="app-input mt-1"
              />
            </label>

            <label className="app-label">
              Location
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="app-input mt-1"
              />
            </label>

            <label className="app-label">
              Room Color
              <div className="mt-1 flex items-center gap-3">
                <input
                  type="color"
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  className="h-11 w-14 rounded-lg border border-slate-200 bg-white p-1"
                />
                <span className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600">
                  {form.color}
                </span>
              </div>
            </label>

            <label className="app-label">
              Room Image URL
              <input
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://example.com/room-photo.jpg"
                className="app-input mt-1"
              />
            </label>

            {form.image_url && (
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                <img
                  src={form.image_url}
                  alt="Room preview"
                  className="h-40 w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

            {editingId ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <button onClick={updateRoom} className="app-button-primary">
                  Update Room
                </button>
                <button onClick={resetForm} className="app-button-secondary">
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={createRoom} className="app-button-primary w-full">
                Create Room
              </button>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Rooms</h2>
            <p className="mt-1 text-sm text-slate-500">
              Maintain room capacity, location, and calendar color.
            </p>
          </div>

          {rooms.map((room) => (
            <div key={room.id} className="app-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {room.image_url ? (
                    <img
                      src={room.image_url}
                      alt={room.name}
                      className="h-16 w-24 rounded-xl object-cover"
                    />
                  ) : (
                    <div
                      className="h-14 w-2 rounded-full"
                      style={{ backgroundColor: room.color || DEFAULT_ROOM_COLOR }}
                    />
                  )}
                  <div>
                    <h3 className="font-bold text-slate-950">{room.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {room.location} - Capacity {room.capacity}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(room)}
                    className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteRoom(room.id)}
                    className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default AdminRooms;
