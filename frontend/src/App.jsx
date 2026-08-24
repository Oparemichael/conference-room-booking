import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RoomDashboard from "./pages/RoomDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Rooms from "./pages/Rooms";
import AdminRooms from "./pages/AdminRooms";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />
      <Route path="/room/:id" element={<RoomDashboard />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route
        path="/admin-rooms"
        element={
          <ProtectedAdminRoute>
            <AdminRooms />
          </ProtectedAdminRoute>
        }
      />
      <Route
        path="*"
        element={
          <div className="app-shell flex items-center justify-center">
            <div className="material-panel p-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                404
              </p>
              <h1 className="mt-2 text-2xl font-black text-slate-950">
                Page not found
              </h1>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default App;
