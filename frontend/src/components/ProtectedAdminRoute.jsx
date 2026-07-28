import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { clearAdminSession, getAdminHeaders, getAdminToken } from "../utils/auth";

function ProtectedAdminRoute({ children }) {
  const [status, setStatus] = useState(() =>
    getAdminToken() ? "checking" : "unauthorized"
  );

  useEffect(() => {
    const token = getAdminToken();

    if (!token) {
      return;
    }

    fetch("http://localhost:5000/api/auth/me", {
      headers: getAdminHeaders(),
    })
      .then((res) => {
        if (!res.ok) {
          clearAdminSession();
          setStatus("unauthorized");
          return;
        }

        setStatus("authorized");
      })
      .catch(() => {
        clearAdminSession();
        setStatus("unauthorized");
      });
  }, []);

  if (status === "checking") {
    return (
      <div className="app-shell flex items-center justify-center">
        <div className="app-card p-6 text-slate-600">Checking admin session...</div>
      </div>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;
