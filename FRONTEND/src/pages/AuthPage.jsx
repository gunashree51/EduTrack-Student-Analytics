import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import { publicApi } from "../utils/api.js";
import { IcoGradCap } from "../components/Icons.jsx";

export default function AuthPage() {
  const { login, toast } = useApp();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ fullName:"", email:"", password:"", role:"TEACHER" });
  const [error, setError] = useState("");
  const [busy,  setBusy]  = useState(false);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    setError(""); setBusy(true);
    try {
      const res  = await publicApi(`/auth/${mode}`, form);
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Something went wrong"); return; }
      login(data.token, { fullName:data.fullName, email:data.email, role:data.role });
      toast(`Welcome, ${data.fullName}!`);
    } catch {
      setError("Cannot reach the server. The app runs in demo mode — connect the Spring Boot backend on port 8080 to save real data.");
    } finally { setBusy(false); }
  };

  const handleKey = e => { if (e.key === "Enter") submit(); };

  return (
    <div className="auth-wrap">
      {/* ── Left panel ── */}
      <div className="auth-left">
        <div className="auth-left-glow1" />
        <div className="auth-left-glow2" />
        <div className="auth-left-grid" />

        <div className="auth-logo">
          <div className="auth-logo-gem"><IcoGradCap size={26} /></div>
          <span className="auth-logo-name">EduTrack</span>
        </div>

        <h1 className="auth-headline">
          Track student<br />
          <span>performance</span><br />
          with clarity.
        </h1>

        <p className="auth-desc">
          A unified analytics platform for teachers and administrators to monitor
          attendance, grades, and academic trends in real time.
        </p>

        <div className="auth-features">
          {[
            "Real-time attendance tracking",
            "Subject-wise grade analytics",
            "Student performance reports",
            "JWT-secured access control",
            "Full CRUD — add, edit, delete",
          ].map(f => (
            <div className="auth-feat" key={f}>
              <div className="auth-feat-dot" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="auth-right">
        <div className="auth-form">
          <h2>{mode === "login" ? "Sign in" : "Create account"}</h2>
          <p>
            {mode === "login"
              ? "Access your analytics dashboard."
              : "Set up your EduTrack workspace."}
          </p>

          {error && <div className="error-box">{error}</div>}

          {mode === "register" && (
            <div className="form-group" style={{ marginBottom:14 }}>
              <label className="form-label">Full name</label>
              <input className="form-input" placeholder="Jane Smith"
                value={form.fullName} onChange={set("fullName")} onKeyDown={handleKey} />
            </div>
          )}

          <div className="form-group" style={{ marginBottom:14 }}>
            <label className="form-label">Email address</label>
            <input className="form-input" type="email" placeholder="you@school.edu"
              value={form.email} onChange={set("email")} onKeyDown={handleKey} />
          </div>

          <div className="form-group" style={{ marginBottom: mode==="register" ? 14 : 22 }}>
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••"
              value={form.password} onChange={set("password")} onKeyDown={handleKey} />
          </div>

          {mode === "register" && (
            <div className="form-group" style={{ marginBottom:22 }}>
              <label className="form-label">Role</label>
              <select className="form-select" value={form.role} onChange={set("role")}>
                <option value="TEACHER">Teacher</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          )}

          <button className="auth-submit" onClick={submit} disabled={busy}>
            {busy ? "Authenticating…" : mode==="login" ? "Sign in →" : "Create account →"}
          </button>

          <p className="auth-switch">
            {mode === "login"
              ? <>No account? <a onClick={() => { setMode("register"); setError(""); }}>Register here</a></>
              : <>Have an account? <a onClick={() => { setMode("login"); setError(""); }}>Sign in</a></>}
          </p>
        </div>
      </div>
    </div>
  );
}
