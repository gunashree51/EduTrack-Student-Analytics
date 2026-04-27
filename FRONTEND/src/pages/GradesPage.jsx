import { useState } from "react";
import { useApp } from "../context/AppContext.jsx";
import Modal from "../components/Modal.jsx";
import { ExamBadge } from "../components/Badges.jsx";
import { DEMO_GRADES, DEMO_STUDENTS } from "../utils/demoData.js";

// Auto-compute grade letter from percentage
function autoGrade(got, total) {
  const p = (Number(got) / Number(total)) * 100;
  if (p >= 90) return "A+"; if (p >= 80) return "A";
  if (p >= 70) return "B+"; if (p >= 60) return "B";
  if (p >= 50) return "C";  if (p >= 40) return "D"; return "F";
}

// Color mapping per grade letter
function gradeStyle(letter) {
  if (letter === "A") return { color:"var(--emerald)", bg:"var(--em-g)", barColor:"var(--emerald)" };
  if (letter === "B") return { color:"var(--blue)",    bg:"var(--blue-g)", barColor:"var(--blue)" };
  if (letter === "C") return { color:"var(--amber)",   bg:"var(--amb-g)", barColor:"var(--amber)" };
  return { color:"var(--rose)", bg:"var(--rose-g)", barColor:"var(--rose)" };
}

export default function GradesPage() {
  const { api, grades, setGrades, students, toast } = useApp();
  const [modal, setModal] = useState(null);

  const G = grades.length   ? grades   : DEMO_GRADES;
  const S = students.length ? students : DEMO_STUDENTS;

  const handleSave = async (data) => {
    try {
      const isEdit = !!data.id;
      const res    = await api(isEdit ? `/grades/${data.id}` : "/grades", isEdit ? "PUT" : "POST", data);
      if (!res.ok) { const d = await res.json(); toast(d.message || "Error", "error"); return; }
      const saved = await res.json();
      setGrades(prev => isEdit ? prev.map(g => g.id===saved.id ? saved : g) : [...prev, saved]);
      toast(isEdit ? "Grade updated" : "Grade added");
      setModal(null);
    } catch { toast("Backend offline — demo mode", "error"); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this grade record?")) return;
    try {
      await api(`/grades/${id}`, "DELETE");
      setGrades(p => p.filter(g => g.id !== id));
      toast("Grade deleted");
    } catch { toast("Delete failed", "error"); }
  };

  return (
    <div className="page">
      <div className="table-card">
        <div className="table-top">
          <div className="table-top-title">Grade Records — {G.length} entries</div>
          <button className="btn btn-primary btn-sm" onClick={() => setModal({})}>+ Add Grade</button>
        </div>
        <table>
          <thead>
            <tr><th>Student</th><th>Subject</th><th>Exam Type</th><th>Marks</th><th>Score</th><th>Grade</th><th>Year</th><th>Remarks</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {G.length === 0 ? (
              <tr><td colSpan={9}><div className="empty-state">
                <div className="empty-icon">📝</div>
                <div className="empty-title">No grades yet</div>
                <div className="empty-sub">Record your first exam marks</div>
              </div></td></tr>
            ) : G.map(g => {
              const pct   = Math.round((g.marksObtained / g.totalMarks) * 100);
              const gl    = (g.grade || "F")[0];
              const style = gradeStyle(gl);
              return (
                <tr key={g.id}>
                  <td>
                    <span className="s-av" style={{ width:26, height:26, fontSize:10 }}>
                      {(g.student?.fullName || "?")[0]}
                    </span>
                    <strong style={{ fontSize:13 }}>{g.student?.fullName || "—"}</strong>
                  </td>
                  <td style={{ color:"var(--t2)" }}>{g.subject}</td>
                  <td><ExamBadge type={g.examType} /></td>
                  <td style={{ fontFamily:"var(--mono)", fontSize:12, color:"var(--t2)" }}>
                    {g.marksObtained}/{g.totalMarks}
                  </td>
                  <td style={{ minWidth:120 }}>
                    <div className="prog-wrap">
                      <div className="prog-track">
                        <div className="prog-fill"
                          style={{ width:`${pct}%`, background:style.barColor,
                            boxShadow:`0 0 8px ${style.barColor}50` }} />
                      </div>
                      <div className="prog-val" style={{ color:style.barColor }}>{pct}%</div>
                    </div>
                  </td>
                  <td>
                    <div className="grade-pill" style={{
                      background: style.bg, color: style.color,
                      boxShadow: `0 0 12px ${style.color}25`
                    }}>{g.grade}</div>
                  </td>
                  <td style={{ color:"var(--t3)", fontSize:11 }}>{g.academicYear}</td>
                  <td style={{ color:"var(--t3)", fontSize:12, maxWidth:120, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {g.remarks || "—"}
                  </td>
                  <td>
                    <div className="btn-row">
                      <button className="btn btn-sm btn-edit" onClick={() => setModal(g)}>Edit</button>
                      <button className="btn btn-sm btn-del"  onClick={() => handleDelete(g.id)}>Del</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal !== null && <GradeModal grade={modal} students={S} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
}

function GradeModal({ grade, students, onSave, onClose }) {
  const isEdit = !!grade?.id;
  const [f, setF] = useState({
    studentId:     grade.student?.id   || "",
    subject:       grade.subject        || "",
    examType:      grade.examType       || "Midterm",
    marksObtained: grade.marksObtained  || "",
    totalMarks:    grade.totalMarks     || 100,
    grade:         grade.grade          || "",
    academicYear:  grade.academicYear   || "2024-25",
    remarks:       grade.remarks        || "",
    ...(isEdit ? { id: grade.id } : {}),
  });

  const s = k => e => {
    const updated = { ...f, [k]: e.target.value };
    // Auto-compute grade letter when marks change
    if ((k==="marksObtained"||k==="totalMarks") && updated.marksObtained && updated.totalMarks)
      updated.grade = autoGrade(updated.marksObtained, updated.totalMarks);
    setF(updated);
  };

  return (
    <Modal title={isEdit ? "Edit Grade" : "Add Grade"} onClose={onClose}>
      <div className="form-grid">
        <div className="form-group form-full">
          <label className="form-label">Student *</label>
          <select className="form-select" value={f.studentId} onChange={s("studentId")}>
            <option value="">Select student…</option>
            {students.map(st => <option key={st.id} value={st.id}>{st.fullName} ({st.rollNumber})</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Subject *</label>
          <input className="form-input" placeholder="Mathematics" value={f.subject} onChange={s("subject")} />
        </div>
        <div className="form-group">
          <label className="form-label">Exam type *</label>
          <select className="form-select" value={f.examType} onChange={s("examType")}>
            {["Quiz","Midterm","Final","Assignment","Unit Test"].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Marks obtained *</label>
          <input className="form-input" type="number" value={f.marksObtained} onChange={s("marksObtained")} />
        </div>
        <div className="form-group">
          <label className="form-label">Total marks *</label>
          <input className="form-input" type="number" value={f.totalMarks} onChange={s("totalMarks")} />
        </div>
        <div className="form-group">
          <label className="form-label">Grade (auto-computed)</label>
          <input className="form-input" value={f.grade} onChange={s("grade")} placeholder="A+" />
        </div>
        <div className="form-group">
          <label className="form-label">Academic year *</label>
          <input className="form-input" placeholder="2024-25" value={f.academicYear} onChange={s("academicYear")} />
        </div>
        <div className="form-group form-full">
          <label className="form-label">Remarks</label>
          <input className="form-input" placeholder="Optional comment…" value={f.remarks} onChange={s("remarks")} />
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={() => onSave({
          ...f,
          studentId: Number(f.studentId),
          marksObtained: Number(f.marksObtained),
          totalMarks: Number(f.totalMarks),
        })}>
          {isEdit ? "Save Changes" : "Add Grade"}
        </button>
      </div>
    </Modal>
  );
}
