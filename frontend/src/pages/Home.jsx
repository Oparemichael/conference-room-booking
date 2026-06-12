function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50">

      {/* 🟦 NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* 🏷 BRAND */}
          <h1 className="text-xl font-bold text-gray-800">
            Conference Room Booking
          </h1>

          {/* 🔗 LINKS */}
          <div className="flex gap-6 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600 transition">Home</a>
            <a href="/rooms" className="hover:text-blue-600 transition">Rooms</a>
            <a href="/admin-login" className="hover:text-blue-600 transition">Admin</a>
          </div>

        </div>
      </nav>

      {/* 🌟 HERO SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">

        {/* 🟣 BADGE */}
        <div className="inline-block px-4 py-1 mb-6 text-sm bg-blue-100 text-blue-700 rounded-full">
          Smart Scheduling System
        </div>

        {/* 🧠 MAIN TITLE */}
        <h2 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Book Meeting Rooms <br />
          <span className="text-purple-600">Without Conflicts</span>
        </h2>

        {/* 📝 SUBTEXT */}
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
          A modern room booking system with real-time availability,
          conflict prevention, and admin control — built for teams.
        </p>

        {/* 🚀 CTA BUTTONS */}
        <div className="flex justify-center gap-4">
          <a
            href="/rooms"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            View Rooms
          </a>

          <a
            href="/admin"
            className="bg-white border px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Dashboard
          </a>
        </div>
      </div>

      {/* 📊 STATS SECTION */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6 pb-20">

        {/* 🟦 CARD 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
          <h3 className="text-2xl font-bold text-blue-600">24/7</h3>
          <p className="text-gray-600 mt-2">System Availability</p>
        </div>

        {/* 🟩 CARD 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
          <h3 className="text-2xl font-bold text-green-600">0</h3>
          <p className="text-gray-600 mt-2">Double Bookings Allowed</p>
        </div>

        {/* 🟨 CARD 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
          <h3 className="text-2xl font-bold text-purple-600">Instant</h3>
          <p className="text-gray-600 mt-2">Booking Updates</p>
        </div>

      </div>

      {/* 🧩 FOOTER */}
      <footer className="text-center text-gray-500 text-sm pb-10">
        © {new Date().getFullYear()} Conference Room Booking System
      </footer>

    </div>
  );
}

export default Home;