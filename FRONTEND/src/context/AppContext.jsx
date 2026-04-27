import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { apiCall } from "../utils/api.js";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("et_tok"));
  const [user,  setUser]  = useState(() => {
    try { return JSON.parse(localStorage.getItem("et_usr") || "null"); } catch { return null; }
  });
  const [students,   setStudents]   = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [grades,     setGrades]     = useState([]);
  const [toasts,     setToasts]     = useState([]);
  const [page,       setPage]       = useState("dashboard");

  const api = useCallback((path, method = "GET", body = null) =>
    apiCall(token, path, method, body), [token]);

  const toast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3400);
  }, []);

  const login = (tok, usr) => {
    setToken(tok); setUser(usr);
    localStorage.setItem("et_tok", tok);
    localStorage.setItem("et_usr", JSON.stringify(usr));
  };

  const logout = () => {
    setToken(null); setUser(null);
    setStudents([]); setAttendance([]); setGrades([]);
    localStorage.removeItem("et_tok"); localStorage.removeItem("et_usr");
    setPage("dashboard");
  };

  const loadAll = useCallback(async () => {
    if (!token) return;
    try {
      const [s, a, g] = await Promise.all([
        api("/students").then(r => r.json()),
        api("/attendance").then(r => r.json()),
        api("/grades").then(r => r.json()),
      ]);
      if (Array.isArray(s)) setStudents(s);
      if (Array.isArray(a)) setAttendance(a);
      if (Array.isArray(g)) setGrades(g);
    } catch { /* demo mode */ }
  }, [api, token]);

  useEffect(() => { if (token) loadAll(); }, [token]);

  return (
    <Ctx.Provider value={{ token, user, login, logout, api, toast, toasts, students, setStudents, attendance, setAttendance, grades, setGrades, loadAll, page, setPage }}>
      {children}
    </Ctx.Provider>
  );
}
