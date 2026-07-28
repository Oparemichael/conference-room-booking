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
      <Route path="*" element={<p>Page Not Found</p>} />
    </Routes>
  );
}

export default App;
