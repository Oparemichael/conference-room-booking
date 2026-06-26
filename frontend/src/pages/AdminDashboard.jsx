import { useEffect, useState } from "react";
import Admin from "./Admin";

const API_BASE_URL = "http://localhost:5000/api";

const toDateTimeLocalValue = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
};

const toApiDateTime = (value) => {
  if (!value) return null;
  return new Date(value).toISOString();
};

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadDashboardData = async () => {
    const [bookingsRes, roomsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/bookings`),
      fetch(`${API_BASE_URL}/rooms`),
    ]);

    const [bookingsData, roomsData] = await Promise.all([
      bookingsRes.json(),
      roomsRes.json(),
    ]);

    if (!bookingsRes.ok) {
      throw new Error(bookingsData.message || "Failed to load bookings");
    }

    if (!roomsRes.ok) {
      throw new Error(roomsData.message || "Failed to load rooms");
    }

    setBookings(bookingsData);
    setRooms(roomsData);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboardData().catch((error) => {
      console.error(error);
      alert(error.message || "Failed to load admin dashboard data");
    });
  }, [refreshKey]);

  const getRoomName = (roomId) => {
    const room = rooms.find((r) => Number(r.id) === Number(roomId));
    return room ? room.name : roomId;
  };

  const editBooking = (booking) => {
    setEditingBooking({
      ...booking,
      room_id: String(booking.room_id),
      start_time: toDateTimeLocalValue(booking.start_time),
      end_time: toDateTimeLocalValue(booking.end_time),
    });
  };

  const handleEditFieldChange = (field, value) => {
    setEditingBooking((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const requestDeleteBooking = (booking) => {
    setBookingToDelete(booking);
  };

  const deleteBooking = async () => {
    if (!bookingToDelete) return;

    try {
      setIsDeleting(true);

      const response = await fetch(`${API_BASE_URL}/bookings/${bookingToDelete.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setBookings((prev) => prev.filter((b) => b.id !== bookingToDelete.id));
      setBookingToDelete(null);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to delete booking");
    } finally {
      setIsDeleting(false);
    }
  };

  const saveEdit = async () => {
    if (!editingBooking) return;

    try {
      const payload = {
        room_id: Number(editingBooking.room_id),
        meeting_title: editingBooking.meeting_title,
        full_name: editingBooking.full_name,
        email: editingBooking.email,
        purpose: editingBooking.purpose,
        start_time: toApiDateTime(editingBooking.start_time),
        end_time: toApiDateTime(editingBooking.end_time),
        status: editingBooking.status || "pending",
      };

      const response = await fetch(
        `${API_BASE_URL}/bookings/${editingBooking.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update booking");
      }

      setBookings((prev) => prev.map((b) => (b.id === data.id ? data : b)));
      setEditingBooking(null);
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to update booking");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-5">
      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Edit Booking</h2>
              <button
                onClick={() => setEditingBooking(null)}
                className="rounded-md px-3 py-1 text-sm text-gray-500 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-gray-700">
                Room
                <select
                  value={editingBooking.room_id}
                  onChange={(e) => handleEditFieldChange("room_id", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                >
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-medium text-gray-700">
                Status
                <select
                  value={editingBooking.status || "pending"}
                  onChange={(e) => handleEditFieldChange("status", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </label>

              <label className="text-sm font-medium text-gray-700">
                Meeting Title
                <input
                  value={editingBooking.meeting_title || ""}
                  onChange={(e) =>
                    handleEditFieldChange("meeting_title", e.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                />
              </label>

              <label className="text-sm font-medium text-gray-700">
                Full Name
                <input
                  value={editingBooking.full_name || ""}
                  onChange={(e) => handleEditFieldChange("full_name", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                />
              </label>

              <label className="text-sm font-medium text-gray-700">
                Email
                <input
                  type="email"
                  value={editingBooking.email || ""}
                  onChange={(e) => handleEditFieldChange("email", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                />
              </label>

              <label className="text-sm font-medium text-gray-700">
                Purpose
                <input
                  value={editingBooking.purpose || ""}
                  onChange={(e) => handleEditFieldChange("purpose", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                />
              </label>

              <label className="text-sm font-medium text-gray-700">
                Start
                <input
                  type="datetime-local"
                  value={editingBooking.start_time || ""}
                  onChange={(e) => handleEditFieldChange("start_time", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                />
              </label>

              <label className="text-sm font-medium text-gray-700">
                End
                <input
                  type="datetime-local"
                  value={editingBooking.end_time || ""}
                  onChange={(e) => handleEditFieldChange("end_time", e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditingBooking(null)}
                className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {bookingToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-lg font-bold text-red-600">
                !
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Delete booking?</h2>
                <p className="mt-2 text-sm text-gray-600">
                  This will permanently remove the booking from the calendar and
                  admin table.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
              <p className="font-semibold text-gray-900">
                {bookingToDelete.meeting_title || "Untitled meeting"}
              </p>
              <p className="mt-1 text-gray-600">
                {getRoomName(bookingToDelete.room_id)} by {bookingToDelete.full_name}
              </p>
              <p className="mt-1 text-gray-500">
                {new Date(bookingToDelete.start_time).toLocaleString()}
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setBookingToDelete(null)}
                disabled={isDeleting}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={deleteBooking}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
              >
                {isDeleting ? "Deleting..." : "Delete Booking"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-5">
        <Admin key={refreshKey} />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">All Bookings</h2>
            <p className="mt-1 text-sm text-gray-500">
              Edit booking details or remove a reservation from the schedule.
            </p>
          </div>
          <a
            href="/admin-rooms"
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Manage Rooms
          </a>
        </div>

        <div className="mt-5 w-full overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3">Room</th>
                <th className="px-4 py-3">Meeting</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Purpose</th>
                <th className="px-4 py-3">Start</th>
                <th className="px-4 py-3">End</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <tr key={booking.id} className="transition hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-700">
                    {getRoomName(booking.room_id)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {booking.meeting_title}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{booking.full_name}</td>
                  <td className="px-4 py-3 text-gray-600">{booking.email}</td>
                  <td className="px-4 py-3 text-gray-600">{booking.purpose}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {new Date(booking.start_time).toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {new Date(booking.end_time).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-600">
                    {booking.status || "pending"}
                  </td>
                  <td className="space-x-2 px-4 py-3 text-right">
                    <button
                      onClick={() => editBooking(booking)}
                      className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => requestDeleteBooking(booking)}
                      className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
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
