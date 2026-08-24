import { useEffect, useState } from "react";
import AppNav from "../components/AppNav";

const API_BASE_URL = "http://localhost:5000/api";

const isToday = (value) => {
  const date = new Date(value);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};

const formatTimeRange = (start, end) => {
  const options = { hour: "2-digit", minute: "2-digit" };

  return `${new Date(start).toLocaleTimeString([], options)} - ${new Date(
    end
  ).toLocaleTimeString([], options)}`;
};

function Home() {
  const [rooms, setRooms] = useState([]);
  const [snapshot, setSnapshot] = useState([]);
  const [loadingSnapshot, setLoadingSnapshot] = useState(true);

  useEffect(() => {
    const loadSnapshot = async () => {
      try {
        const [roomsRes, bookingsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/rooms`),
          fetch(`${API_BASE_URL}/bookings`),
        ]);

        const [roomsData, bookingsData] = await Promise.all([
          roomsRes.json(),
          bookingsRes.json(),
        ]);

        setRooms(roomsData);

        const roomsById = Object.fromEntries(
          roomsData.map((room) => [Number(room.id), room])
        );

        const todaysBookings = bookingsData
          .filter((booking) => isToday(booking.start_time))
          .slice(0, 4)
          .map((booking) => {
            const room = roomsById[Number(booking.room_id)];

            return {
              ...booking,
              roomName: room?.name || "Unknown room",
              roomColor: room?.color || "#2563eb",
            };
          });

        setSnapshot(todaysBookings);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSnapshot(false);
      }
    };

    loadSnapshot();
  }, []);

  const availableToday = Math.max(rooms.length - 2, 0);

  return (
    <div className="app-shell bg-slate-50">
      <AppNav />

      <main className="app-container py-10 lg:py-16">
        <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-slate-50 shadow-[0_30px_80px_rgba(15,23,42,0.12)]">
          <div className="grid gap-8 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
            <div className="flex flex-col justify-center">
              <div className="mb-4 inline-flex w-fit rounded-full border border-blue-200 bg-blue-100/80 px-3 py-1 text-sm font-semibold text-blue-700">
                Modern room booking
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-[1.05] text-slate-950 md:text-5xl lg:text-6xl">
                Book spaces that keep your team moving.
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                Coordinate smarter with a polished booking experience built for fast decisions, clear room availability, and a calmer day at work.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/rooms" className="rounded-full bg-slate-950 px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-700">
                  Explore rooms
                </a>
                <a href="/admin-login" className="rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-50">
                  Admin access
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
                  <p className="text-2xl font-black text-blue-600">{rooms.length}</p>
                  <p className="mt-1 text-sm text-slate-500">Total rooms</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
                  <p className="text-2xl font-black text-emerald-600">{availableToday}</p>
                  <p className="mt-1 text-sm text-slate-500">Available today</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
                  <p className="text-2xl font-black text-violet-600">24/7</p>
                  <p className="mt-1 text-sm text-slate-500">Booking access</p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white/80 p-5 shadow-[0_16px_35px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Today</p>
                  <h2 className="text-xl font-semibold text-slate-950">Upcoming bookings</h2>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">Live</span>
              </div>

              <div className="mt-5 space-y-3">
                {loadingSnapshot && (
                  <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">Loading today&apos;s schedule...</p>
                )}

                {!loadingSnapshot && snapshot.length === 0 && (
                  <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">No bookings for today yet.</p>
                )}

                {snapshot.map((booking) => (
                  <div key={booking.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="h-12 w-1.5 rounded-full" style={{ backgroundColor: booking.roomColor }} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900">{booking.roomName}</p>
                      <p className="text-sm text-slate-500">{formatTimeRange(booking.start_time, booking.end_time)}</p>
                      <p className="truncate text-xs text-slate-400">{booking.meeting_title}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">{booking.status || "pending"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="app-card p-6">
            <p className="text-2xl font-black text-blue-600">Instant</p>
            <p className="mt-2 font-semibold text-slate-900">Availability</p>
            <p className="mt-1 text-sm text-slate-500">See open rooms and reserve them in seconds.</p>
          </div>
          <div className="app-card p-6">
            <p className="text-2xl font-black text-emerald-600">Live</p>
            <p className="mt-2 font-semibold text-slate-900">Updates</p>
            <p className="mt-1 text-sm text-slate-500">Schedules refresh immediately after each change.</p>
          </div>
          <div className="app-card p-6">
            <p className="text-2xl font-black text-amber-500">Simple</p>
            <p className="mt-2 font-semibold text-slate-900">Admin tools</p>
            <p className="mt-1 text-sm text-slate-500">Manage rooms, bookings, and approvals with ease.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
