import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNav from "../components/AppNav";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Unable to sign in");
        return;
      }

      localStorage.setItem("adminToken", data.token);
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError("Could not reach the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-shell min-h-screen">
      <AppNav />

      <main className="app-container grid min-h-[calc(100vh-73px)] items-center gap-10 px-6 py-10 lg:grid-cols-[1fr_420px]">
        <section>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Admin access</p>
          <h1 className="max-w-2xl text-4xl font-black leading-tight text-slate-950 md:text-5xl">
            Manage every room, booking, and approval from one focused workspace.
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-600">
            Review schedules, update reservations, and keep room availability clear for the whole team.
          </p>
        </section>

        <section className="material-panel p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-950">Sign in</h2>
            <p className="mt-2 text-sm text-slate-500">Use your admin credentials to continue.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <label className="app-label">
              Username
              <input value={username} onChange={(e) => setUsername(e.target.value)} className="app-input mt-1" />
            </label>

            <label className="app-label">
              Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="app-input mt-1" />
            </label>

            <button type="submit" disabled={isSubmitting} className="app-button-primary w-full py-3.5">
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default AdminLogin;
