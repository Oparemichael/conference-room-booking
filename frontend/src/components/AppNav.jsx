import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { clearAdminSession, getAdminToken } from "../utils/auth";

const navLinkClass = ({ isActive }) =>
  `lumina-nav-link ${isActive ? "lumina-nav-link--active" : ""}`;

function AppNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = Boolean(getAdminToken());
  const isAdminArea = location.pathname.startsWith("/admin");

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : false;
  });

  useEffect(() => {
    document.body.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleLogout = () => {
    clearAdminSession();
    navigate("/admin-login");
  };

  return (
    <nav className="app-nav sticky top-0 z-40">
      <div className="app-container flex flex-wrap items-center justify-between gap-3 py-3">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-600/25">
            RID
          </span>
          <span>
            <span className="block text-base font-black tracking-tight text-slate-950">
              Conference Rooms
            </span>
            <span className="block text-xs font-semibold text-slate-500">
              Book with ease
            </span>
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/rooms" className={navLinkClass}>
            Rooms
          </NavLink>
          {isAdmin && (
            <>
              <NavLink to="/admin" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/admin-rooms" className={navLinkClass}>
                Manage Rooms
              </NavLink>
            </>
          )}
          {!isAdmin && (
            <NavLink to="/admin-login" className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDarkMode((prev) => !prev)}
            className="lumina-icon-button"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? "L" : "D"}
          </button>

          {isAdminArea && isAdmin ? (
            <button type="button" onClick={handleLogout} className="app-button-secondary">
              Log Out
            </button>
          ) : (
            <Link to={isAdmin ? "/admin" : "/admin-login"} className="app-button-primary">
              {isAdmin ? "Open Admin" : "Admin Login"}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default AppNav;
