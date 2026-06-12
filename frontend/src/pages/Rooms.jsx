import { useState, useEffect } from "react";
import RoomCalendar from "../components/RoomCalendar";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  // 🔄 This is a simple trigger to force calendar refresh
const [refreshKey, setRefreshKey] = useState(0);

  // 🟡 FETCH ALL ROOMS FROM BACKEND
  useEffect(() => {
    fetch("http://localhost:5000/api/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 🟦 PAGE HEADER */}
      <div className="bg-white border-b shadow-sm">
        <div className="px-20 py-4 flex justify-between items-center">
        <div className="max-w-7xl px-16 py-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Meeting Rooms
          </h1>
          <p className="text-gray-600 text-sm">
            Select a room to view schedule and make bookings
          </p>
        </div>
        <div className="flex px-10 gap-6 text-sm ml-10 text-gray-600">
            <a href="/" className="hover:text-blue-600 transition">Home</a>
            <a href="/admin-login" className="hover:text-blue-600 transition">Admin</a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid md:grid-cols-4 gap-6">

        {/* 🟩 LEFT SIDE — ROOM LIST */}
        <div className="md:col-span-1 space-y-3">

          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => {
                // 🟦 Set selected room
                setSelectedRoom(room);

                // 🔄 Force calendar to reload when switching rooms
                setRefreshKey((prev) => prev + 1);
                }}
              className={`cursor-pointer p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition
                ${
                  selectedRoom?.id === room.id
                    ? "border-blue-500"
                    : "border-gray-200"
                }
              `}
            >
              <h2 className="font-semibold text-gray-800">
                {room.name}
              </h2>

              <p className="text-sm text-gray-500">
                {room.location}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Capacity: {room.capacity}
              </p>
            </div>
          ))}
        </div>

        {/* 🟦 RIGHT SIDE — CALENDAR */}
        <div className="md:col-span-3">

          {!selectedRoom ? (
            <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
              Select a room to view calendar
            </div>
          ) : (
            <div className="bg-white border rounded-xl p-4 shadow-sm">
              
              {/* 🏷 ROOM HEADER */}
              <div className="mb-4">
                <h2 className="text-xl font-bold">
                  {selectedRoom.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {selectedRoom.location} • Capacity {selectedRoom.capacity}
                </p>
              </div>

              {/* 📅 CALENDAR */}
              <RoomCalendar
                roomId={selectedRoom.id}
                 refreshKey={refreshKey} // 🔄 tells calendar when to reload
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Rooms;