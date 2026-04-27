import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import Modal from "../components/Modal.jsx";
import { AttBadge } from "../components/Badges.jsx";
import { DEMO_ATTENDANCE, DEMO_STUDENTS } from "../utils/demoData.js";

export default function AttendancePage() {
  const { api, attendance, setAttendance, students, toast } = useApp();
  const [modal, setModal] = useState(null);

  const A = attendance.length ? attendance : DEMO_ATTENDANCE;
  const S = students.length   ? students   : DEMO_STUDENTS;

  const total   = A.length;
  const present = A.filter(a => a.status==="PRESENT").length;
  const absent  = A.filter(a => a.status==="ABSENT").length;
  const late    = A.filter(a => a.status==="LATE").length;

  const handleSave = async (data) => {
    try {
      const isEdit = !!data.id;
      const res    = await api(isEdit ? `/attendance/${data.id}` : "/attendance", isEdit ? "PUT" : "POST", data);
      if (!res.ok) { const d = await res.json(); toast(d.message || "Error", "error"); return; }
      const saved = await res.json();
      setAttendance(prev => isEdit ? prev.map(a => a.id===saved.id ? saved : a) : [...prev, saved]);
      toast(isEdit ? "Record updated" : "Attendance marked");
      setModal(null);
    } catch { toast("Backend offline — demo mode", "error"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this attendance record?")) return;
    try {
      await api(`/attendance/${id}`, "DELETE");
      setAttendance(p => p.filter(a => a.id !== id));
      toast("Record deleted");
    } catch { toast("Delete failed", "error"); }
  };

  return (
    <div className="page">
      {/* Summary chips */}
      <div className="summary-row">
        <div className="sum-chip" style={{ borderLeftColor:"var(--blue)" }}>
          <div className="sum-val" style={{ color:"var(--blue)" }}>{total}</div>
          <div className="sum-lbl">Total Records</div>
        </div>
        <div className="sum-chip" style={{ borderLeftColor:"var(--emerald)" }}>
          <div className="sum-val" style={{ color:"var(--emerald)" }}>{present}</div>
          <div className="sum-lbl">Present</div>
        </div>
        <div className="sum-chip" style={{ borderLeftColor:"var(--rose)" }}>
          <div className="sum-val" style={{ color:"var(--rose)" }}>{absent}</div>
          <div className="sum-lbl">Absent</div>
        </div>
        <div className="sum-chip" style={{ borderLeftColor:"var(--amber)" }}>
          <div className="sum-val" style={{ color:"var(--amber)" }}>{late}</div>
          <div className="sum-lbl">Late</div>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-top">
          <div className="table-top-title">Attendance Records</div>
          <button className="btn btn-primary btn-sm" onClick={() => setModal({})}>+ Mark Attendance</button>
        </div>
        <table>
          <thead>
            <tr><th>Student</th><th>Date</th><th>Subject</th><th>Status</th><th>Remarks</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {A.length === 0 ? (
              <tr><td colSpan={6}><div className="empty-state">
                <div className="empty-icon">📅</div>
                <div className="empty-title">No records yet</div>
                <div className="empty-sub">Mark your first attendance record</div>
              </div></td></tr>
            ) : A.map(a => (
              <tr key={a.id}>
                <td><strong>{a.student?.fullName || "—"}</strong></td>
                <td style={{ fontFamily:"var(--mono)", fontSize:12, color:"var(--t2)" }}>{a.date}</td>
                <td style={{ color:"var(--t2)" }}>{a.subject}</td>
                <td><AttBadge status={a.status} /></td>
                <td style={{ color:"var(--t3)", fontSize:12 }}>{a.remarks || "—"}</td>
                <td>
                  <div className="btn-row">
                    <button className="btn btn-sm btn-edit" onClick={() => setModal(a)}>Edit</button>
                    <button className="btn btn-sm btn-del"  onClick={() => handleDelete(a.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal !== null && <AttendanceModal record={modal} students={S} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}

function AttendanceModal({ record, students, onSave, onClose }) {
  const isEdit = !!record?.id;
  const [f, setF] = useState({
    studentId: record.student?.id || "",
    date:      record.date        || new Date().toISOString().split("T")[0],
    subject:   record.subject     || "",
    status:    record.status      || "PRESENT",
    remarks:   record.remarks     || "",
    ...(isEdit ? { id: record.id } : {}),
  });
  const s = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  return (
    <Modal title={isEdit ? "Edit Record" : "Mark Attendance"} onClose={onClose}>
      <div className="form-grid">
        <div className="form-group form-full">
          <label className="form-label">Student *</label>
          <select className="form-select" value={f.studentId} onChange={s("studentId")}>
            <option value="">Select student…</option>
            {students.map(st => <option key={st.id} value={st.id}>{st.fullName} ({st.rollNumber})</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Date *</label>
          <input className="form-input" type="date" value={f.date} onChange={s("date")} />
        </div>
        <div className="form-group">
          <label className="form-label">Subject *</label>
          <input className="form-input" placeholder="Mathematics" value={f.subject} onChange={s("subject")} />
        </div>
        <div className="form-group form-full">
          <label className="form-label">Status *</label>
          <select className="form-select" value={f.status} onChange={s("status")}>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LATE">Late</option>
          </select>
        </div>
        <div className="form-group form-full">
          <label className="form-label">Remarks</label>
          <input className="form-input" placeholder="Optional note…" value={f.remarks} onChange={s("remarks")} />
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary"
          onClick={() => onSave({ ...f, studentId: Number(f.studentId) })}>
          {isEdit ? "Save Changes" : "Mark Attendance"}
        </button>
      </div>
    </Modal>
  );
}
