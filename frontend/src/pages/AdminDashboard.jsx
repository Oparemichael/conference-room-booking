import { useEffect, useState } from "react";
import Admin from "./Admin";

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [editingBooking, setEditingBooking] =
  useState(null);

  const editBooking = (booking) => {
  setEditingBooking(booking);
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/bookings")
      .then((res) => res.json())
      .then((data) => setBookings(data));
  }, []);

  useEffect(() => {
  fetch("http://localhost:5000/api/bookings")
    .then((res) => res.json())
    .then((data) => setBookings(data));

  fetch("http://localhost:5000/api/rooms")
    .then((res) => res.json())
    .then((data) => setRooms(data));
}, []);


const getRoomName = (roomId) => {
    const room = rooms.find(
        (r) => r.id === roomId
    );

  return room ? room.name : roomId;
    };
  const deleteBooking = async (id) => {
  const confirmed = window.confirm(
    "Delete this booking?"
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      `http://localhost:5000/api/bookings/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Delete failed");
    }

    setBookings((prev) =>
      prev.filter((b) => b.id !== id)
    );

  } catch (error) {
    console.error(error);
    alert("Failed to delete booking");
  }
    };


    const saveEdit = async () => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/bookings/${editingBooking.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingBooking),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    // update table locally
    setBookings((prev) =>
      prev.map((b) =>
        b.id === editingBooking.id ? data : b
      )
    );

    setEditingBooking(null); // close form

    alert("Booking updated successfully!");
  } catch (error) {
    console.error(error);
    alert("Failed to update booking");
  }
};

  return (
    
    <div style={{ padding: "20px" }}>

                {editingBooking && (
                <div
                    style={{
                    border: "1px solid #ddd",
                    padding: "20px",
                    marginBottom: "20px",
                    }}
                >
                    <h2>Edit Booking</h2>

                <input
                placeholder="Meeting Title"
                value={editingBooking.meeting_title}
                onChange={(e) =>
                    setEditingBooking({
                    ...editingBooking,
                    meeting_title: e.target.value,
                    })
                }
                />

                <input
                placeholder="Full Name"
                value={editingBooking.full_name}
                onChange={(e) =>
                    setEditingBooking({
                    ...editingBooking,
                    full_name: e.target.value,
                    })
                }
                />

                <input
                placeholder="Email"
                value={editingBooking.email}
                onChange={(e) =>
                    setEditingBooking({
                    ...editingBooking,
                    email: e.target.value,
                    })
                }
                />

                <input
                placeholder="Purpose"
                value={editingBooking.purpose}
                onChange={(e) =>
                    setEditingBooking({
                    ...editingBooking,
                    purpose: e.target.value,
                    })
                }
                />

                <input
                type="datetime-local"
                value={editingBooking.start_time?.slice(0, 16)}
                onChange={(e) =>
                    setEditingBooking({
                    ...editingBooking,
                    start_time: e.target.value,
                    })
                }
                />

                <input
                type="datetime-local"
                value={editingBooking.end_time?.slice(0, 16)}
                onChange={(e) =>
                    setEditingBooking({
                    ...editingBooking,
                    end_time: e.target.value,
                    })
                }
                />
                  <div style={{ marginTop: "10px" }}>
                    <button onClick={saveEdit}>
                        Save Changes
                    </button>

                    <button
                        onClick={() => setEditingBooking(null)}
                        style={{ marginLeft: "10px" }}
                    >
                        Cancel
                    </button>
                </div>
  
            </div>
        )}

        <div style={{ padding: "20px" }}>
            {/* <h1>Admin Dashboard</h1> */}

            {/* 🟢 MASTER CALENDAR */}
            <Admin />
            {/* 🟢 BOOKINGS TABLE */}
          </div>

      {/* 🟢 ADMIN BOOKINGS TABLE - MODERN UI */}
<div className="mt-6 bg-white rounded-xl shadow-sm border overflow-hidden p-9">

  {/* 🟦 TABLE HEADER */}
  <div className="p-4 border-b bg-gray-50">
    <h2 className="text-lg font-semibold text-gray-700">
      All Bookings
    </h2>
  </div>

  {/* 🟦 TABLE WRAPPER (SCROLLABLE ON SMALL SCREENS) */}
  <div className="bg-white rounded-xl shadow-sm border overflow-hidden w-full">

    <table className="w-full text-sm text-left ">

      {/* 🟢 TABLE HEAD */}
      <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
        <tr>
          <th className="px-4 py-3">Room</th>
          <th className="px-4 py-3">Meeting</th>
          <th className="px-4 py-3">Name</th>
          <th className="px-4 py-3">Email</th>
          <th className="px-4 py-3">Purpose</th>
          <th className="px-4 py-3">Start</th>
          <th className="px-4 py-3">End</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>

      {/* 🟢 TABLE BODY */}
      <tbody className="divide-y divide-gray-100">

        {bookings.map((b) => (
          <tr
            key={b.id}
            className="hover:bg-gray-50 transition"
          >

            {/* 🟦 ROOM */}
            <td className="px-4 py-3 font-medium text-gray-700">
              {getRoomName(b.room_id)}
            </td>

            {/* 🟦 MEETING TITLE */}
            <td className="px-4 py-3 text-gray-800 font-semibold">
              {b.meeting_title}
            </td>

            {/* 🟦 NAME */}
            <td className="px-4 py-3 text-gray-600">
              {b.full_name}
            </td>

            {/* 🟦 EMAIL */}
            <td className="px-4 py-3 text-gray-600">
              {b.email}
            </td>

            {/* 🟦 PURPOSE */}
            <td className="px-4 py-3 text-gray-600">
              {b.purpose}
            </td>

            {/* 🟦 START */}
            <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
              {new Date(b.start_time).toLocaleString()}
            </td>

            {/* 🟦 END */}
            <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
              {new Date(b.end_time).toLocaleString()}
            </td>

            {/* 🟦 ACTIONS */}
            <td className="px-4 py-3 text-right space-x-2">

              {/* EDIT BUTTON */}
              <button
                onClick={() => editBooking(b)}
                className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Edit
              </button>

              {/* DELETE BUTTON */}
              <button
                onClick={() => deleteBooking(b.id)}
                className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>

            </td>

          </tr>
        ))}

      </tbody>
    </table>

    </div>
    </div>
    </div>
  );
}

export default AdminDashboard;