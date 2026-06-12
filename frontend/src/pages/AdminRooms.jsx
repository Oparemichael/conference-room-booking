import { useEffect, useState } from "react";

function AdminRooms() {
  // 🟢 ROOMS LIST
  const [rooms, setRooms] = useState([]);

  // 🟡 FORM STATE
  const [form, setForm] = useState({
    name: "",
    capacity: "",
    location: "",
    color: "#4285F4", // 🆕 DEFAULT COLOR
  });

  // 🟠 EDIT MODE
  const [editingId, setEditingId] = useState(null);

  // 🔄 REFRESH TRIGGER
  const [refreshKey, setRefreshKey] = useState(0);

  // ===============================
  // 📥 FETCH ROOMS
  // ===============================
  useEffect(() => {
    fetch("http://localhost:5000/api/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }, [refreshKey]);

  // ===============================
  // 🟢 INPUT CHANGE
  // ===============================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // ➕ CREATE ROOM
  // ===============================
  const createRoom = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/rooms",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // 🔄 Refresh list
      setRefreshKey((prev) => prev + 1);

      // 🧹 Reset form
      setForm({
        name: "",
        capacity: "",
        location: "",
        color: "#4285F4",
      });
    } catch (err) {
      alert(err.message);
    }
  };

  // ===============================
  // ✏️ START EDIT
  // ===============================
  const startEdit = (room) => {
    setEditingId(room.id);
    setForm({
      name: room.name,
      capacity: room.capacity,
      location: room.location,
      color: room.color || "#4285F4",
    });
  };

  // ===============================
  // 💾 UPDATE ROOM
  // ===============================
  const updateRoom = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/rooms/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

            // 🔄 Reset edit mode
        setEditingId(null);

        // 🧹 Reset form
        setForm({
        name: "",
        capacity: "",
        location: "",
        color: "#4285F4",
        });

        // 🔄 Force refresh from server (single source of truth)
        setRefreshKey((prev) => prev + 1);

    } catch (err) {
      alert(err.message);
    }
  };

    // 🧹 CANCEL EDIT MODE
    const cancelEdit = () => {
    setEditingId(null);

    setForm({
        name: "",
        capacity: "",
        location: "",
        color: "#4285F4",
    });
    };

  // ===============================
  // 🗑 DELETE ROOM
  // ===============================
  const deleteRoom = async (id) => {
    if (!window.confirm("Delete this room?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/rooms/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Delete failed");

      setRefreshKey((prev) => prev + 1);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">

      {/* ========================= */}
      {/* 🟢 FORM */}
      {/* ========================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">

        
        <div className="py-4 flex justify-between items-center">

        <h2 className="text-xl font-bold mb-4">
          {editingId ? "Edit Room" : "Create Room"}
        </h2>
        <div className="flex gap-6 text-sm ml-10 text-gray-600">
        <a href="/admin" className="hover:text-blue-600 transition">Admin</a>
        </div>
        </div>

        <div className="grid gap-3">

          <input
            name="name"
            placeholder="Room Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />

          <input
            name="capacity"
            type="number"
            placeholder="Capacity"
            value={form.capacity}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="border p-2 rounded-lg"
          />

          {/* 🎨 COLOR PICKER */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">
              Room Color:
            </label>

            <input
              type="color"
              name="color"
              value={form.color}
              onChange={handleChange}
              className="w-10 h-10"
            />
          </div>

          {/* ACTION BUTTON */}
          {editingId ? (
            <div className="flex gap-2">

                {/* UPDATE BUTTON */}
                <button
                onClick={updateRoom}
                className="bg-green-600 text-white py-2 rounded-lg flex-1"
                >
                Update Room
                </button>

                {/* CANCEL BUTTON */}
                <button
                onClick={cancelEdit}
                className="bg-gray-400 text-white py-2 rounded-lg flex-1"
                >
                Cancel
                </button>

            </div>
            ) : (
            <button
              onClick={createRoom}
              className="bg-blue-600 text-white py-2 rounded-lg"
            >
              Create Room
            </button>
          )}
        </div>
      </div>

      {/* ========================= */}
      {/* 📋 ROOM LIST */}
      {/* ========================= */}
      <div className="grid gap-3">

        {rooms.map((room) => (
          <div
            key={room.id}
            className="flex justify-between items-center border p-4 rounded-lg bg-white"
          >

            {/* LEFT */}
            <div className="flex items-center gap-3">

              {/* COLOR DOT */}
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor:
                    room.color || "#6366F1",
                }}
              />

              <div>
                <h3 className="font-semibold">
                  {room.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Capacity: {room.capacity}
                </p>
                <p className="text-sm text-gray-500">
                  {room.location}
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">

              <button
                onClick={() => startEdit(room)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteRoom(room.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default AdminRooms;