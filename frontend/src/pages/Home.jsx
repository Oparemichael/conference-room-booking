function Home() {
  return (
    <div className="app-shell">
      <nav className="app-nav">
        <div className="app-container flex items-center justify-between py-4">
          <a href="/" className="text-lg font-bold text-slate-950">
            Conference Room Booking
          </a>

          <div className="flex items-center gap-2 text-sm font-medium">
            <a href="/rooms" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-blue-700">
              Rooms
            </a>
            <a href="/admin-login" className="app-button-secondary">
              Admin Login
            </a>
          </div>
        </div>
      </nav>

      <main className="app-container py-14 lg:py-20">
        <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700">
              Conflict-free room scheduling
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-normal text-slate-950 md:text-6xl">
              Book the right room without calendar confusion.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              See room availability, reserve meeting time, and help admins keep
              every schedule clear from one simple workspace.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="/rooms" className="app-button-primary px-6 py-3">
                View Rooms
              </a>
              <a href="/admin-login" className="app-button-secondary px-6 py-3">
                Admin Login
              </a>
            </div>
          </div>

          <div className="app-card overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
              <p className="text-sm font-semibold text-slate-500">Today</p>
              <h2 className="text-xl font-bold text-slate-950">Room Snapshot</h2>
            </div>
            <div className="space-y-4 p-6">
              {[
                ["Boardroom", "09:00 - 10:30", "#2563eb"],
                ["Strategy Room", "11:00 - 12:00", "#059669"],
                ["Focus Suite", "14:00 - 15:30", "#f59e0b"],
              ].map(([room, time, color]) => (
                <div key={room} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-4">
                  <div className="h-12 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900">{room}</p>
                    <p className="text-sm text-slate-500">{time}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    Scheduled
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-4 md:grid-cols-3">
          <div className="app-card p-6">
            <p className="text-3xl font-black text-blue-600">0</p>
            <p className="mt-2 font-semibold text-slate-900">Double bookings</p>
            <p className="mt-1 text-sm text-slate-500">Overlaps are blocked before they reach the calendar.</p>
          </div>
          <div className="app-card p-6">
            <p className="text-3xl font-black text-emerald-600">Live</p>
            <p className="mt-2 font-semibold text-slate-900">Availability</p>
            <p className="mt-1 text-sm text-slate-500">Room schedules update after each booking change.</p>
          </div>
          <div className="app-card p-6">
            <p className="text-3xl font-black text-amber-500">Admin</p>
            <p className="mt-2 font-semibold text-slate-900">Control</p>
            <p className="mt-1 text-sm text-slate-500">Manage rooms, colors, bookings, and approvals.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
