import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import Modal from "../components/Modal.jsx";
import { StatusBadge } from "../components/Badges.jsx";
import { IcoSearch } from "../components/Icons.jsx";
import { DEMO_STUDENTS } from "../utils/demoData.js";

export default function StudentsPage({ triggerAdd, onAddDone }) {
  const { api, students, setStudents, toast } = useApp();
  const [q, setQ]         = useState("");
  const [modal, setModal] = useState(null);

  // If topbar "Add Student" was clicked, open modal
  useState(() => { if (triggerAdd) { setModal({}); onAddDone && onAddDone(); } }, [triggerAdd]);

  const S = students.length ? students : DEMO_STUDENTS;
  const filtered = S.filter(s => {
    const q2 = q.toLowerCase();
    return s.fullName?.toLowerCase().includes(q2) ||
      s.rollNumber?.toLowerCase().includes(q2) ||
      s.className?.toLowerCase().includes(q2);
  });

  const handleSave = async (data) => {
    try {
      const isEdit = !!data.id;
      const res    = await api(isEdit ? `/students/${data.id}` : "/students", isEdit ? "PUT" : "POST", data);
      if (!res.ok) { const d = await res.json(); toast(d.message || "Save failed", "error"); return; }
      const saved = await res.json();
      setStudents(prev => isEdit ? prev.map(s => s.id===saved.id ? saved : s) : [...prev, saved]);
      toast(isEdit ? "Student updated" : "Student added");
      setModal(null);
    } catch { toast("Backend offline — running in demo mode", "error"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this student? All linked attendance and grades will be removed.")) return;
    try {
      await api(`/students/${id}`, "DELETE");
      setStudents(p => p.filter(s => s.id !== id));
      toast("Student removed");
    } catch { toast("Delete failed", "error"); }
  };

  return (
    <div className="page">
      <div className="table-card">
        <div className="table-top">
          <div className="table-top-title">All Students — {filtered.length} records</div>
          <div className="table-actions">
            <div className="search-box">
              <span className="search-icon"><IcoSearch /></span>
              <input placeholder="Search by name, roll, or class…"
                value={q} onChange={e => setQ(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setModal({})}>+ Add Student</button>
          </div>
        </div>
        <table>
          <thead>
            <tr><th>Student</th><th>Roll No.</th><th>Class</th><th>Sec.</th><th>Email</th><th>Parent</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8}><div className="empty-state">
                <div className="empty-icon">👥</div>
                <div className="empty-title">No students found</div>
                <div className="empty-sub">Add your first student or adjust the search</div>
              </div></td></tr>
            ) : filtered.map(s => (
              <tr key={s.id}>
                <td><span className="s-av">{s.fullName[0]}</span><strong>{s.fullName}</strong></td>
                <td><span className="mono-tag">{s.rollNumber}</span></td>
                <td style={{ color:"var(--t2)" }}>{s.className}</td>
                <td style={{ color:"var(--t2)" }}>{s.section}</td>
                <td style={{ color:"var(--t3)", fontSize:12 }}>{s.email}</td>
                <td style={{ color:"var(--t3)", fontSize:12 }}>{s.parentName || "—"}</td>
                <td><StatusBadge status={s.status} /></td>
                <td>
                  <div className="btn-row">
                    <button className="btn btn-sm btn-edit" onClick={() => setModal(s)}>Edit</button>
                    <button className="btn btn-sm btn-del"  onClick={() => handleDelete(s.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal !== null && <StudentModal student={modal} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}

function StudentModal({ student, onSave, onClose }) {
  const isEdit = !!student?.id;
  const [f, setF] = useState({
    fullName:"", rollNumber:"", email:"", className:"", section:"",
    phone:"", parentName:"", parentPhone:"", address:"", status:"ACTIVE",
    ...(isEdit ? student : {}),
  });
  const s = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  return (
    <Modal title={isEdit ? "Edit Student" : "Add New Student"} onClose={onClose}>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Full name *</label>
          <input className="form-input" placeholder="Arjun Sharma" value={f.fullName} onChange={s("fullName")} />
        </div>
        <div className="form-group">
          <label className="form-label">Roll number *</label>
          <input className="form-input" placeholder="S001" value={f.rollNumber} onChange={s("rollNumber")} />
        </div>
        <div className="form-group form-full">
          <label className="form-label">Email address *</label>
          <input className="form-input" type="email" placeholder="student@school.com" value={f.email} onChange={s("email")} />
        </div>
        <div className="form-group">
          <label className="form-label">Class *</label>
          <input className="form-input" placeholder="10th Grade" value={f.className} onChange={s("className")} />
        </div>
        <div className="form-group">
          <label className="form-label">Section *</label>
          <input className="form-input" placeholder="A" value={f.section} onChange={s("section")} />
        </div>
        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-input" value={f.phone} onChange={s("phone")} />
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select" value={f.status} onChange={s("status")}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Parent name</label>
          <input className="form-input" value={f.parentName} onChange={s("parentName")} />
        </div>
        <div className="form-group">
          <label className="form-label">Parent phone</label>
          <input className="form-input" value={f.parentPhone} onChange={s("parentPhone")} />
        </div>
        <div className="form-group form-full">
          <label className="form-label">Address</label>
          <input className="form-input" value={f.address} onChange={s("address")} />
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={() => onSave(f)}>
          {isEdit ? "Save Changes" : "Add Student"}
        </button>
      </div>
    </Modal>
  );
}
