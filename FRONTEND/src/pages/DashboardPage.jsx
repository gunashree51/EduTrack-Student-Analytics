import { useApp } from "../context/AppContext.jsx";
import StatCard   from "../components/StatCard.jsx";
import DonutChart from "../components/DonutChart.jsx";
import { StatusBadge } from "../components/Badges.jsx";
import { IcoUsers, IcoCal, IcoGrade, IcoWarn } from "../components/Icons.jsx";
import { DEMO_STUDENTS, DEMO_ATTENDANCE, DEMO_GRADES } from "../utils/demoData.js";

const BAR_COLORS = [
  { color:"#a78bfa", bg:"rgba(167,139,250,0.3)" },
  { color:"#fbbf24", bg:"rgba(251,191,36,0.3)"  },
  { color:"#4f8ef7", bg:"rgba(79,142,247,0.3)"  },
  { color:"#22d3ee", bg:"rgba(34,211,238,0.3)"  },
  { color:"#34d399", bg:"rgba(52,211,153,0.3)"  },
];

export default function DashboardPage() {
  const { students, attendance, grades } = useApp();

  const S = students.length   ? students   : DEMO_STUDENTS;
  const A = attendance.length ? attendance : DEMO_ATTENDANCE;
  const G = grades.length     ? grades     : DEMO_GRADES;

  // Stats
  const active    = S.filter(s => s.status === "ACTIVE").length;
  const present   = A.filter(a => a.status === "PRESENT").length;
  const attPct    = A.length ? Math.round((present / A.length) * 100) : 87;
  const pAbsent   = A.length ? Math.round((A.filter(a => a.status==="ABSENT").length / A.length)*100) : 9;
  const pLate     = 100 - attPct - pAbsent;

  // Attendance summary counts for the donut legend
  const pPresent  = attPct;

  // Subject bars
  const subjMap = {};
  G.forEach(g => {
    if (!subjMap[g.subject]) subjMap[g.subject] = [];
    subjMap[g.subject].push((g.marksObtained / g.totalMarks) * 100);
  });
  const bars = Object.entries(subjMap)
    .slice(0, 5)
    .map(([name, scores], i) => ({
      name,
      pct: Math.round(scores.reduce((a,b) => a+b, 0) / scores.length),
      ...BAR_COLORS[i % BAR_COLORS.length],
    }));
  if (!bars.length) [
    { name:"Computer Sci", pct:91, ...BAR_COLORS[0] },
    { name:"English",      pct:88, ...BAR_COLORS[1] },
    { name:"Mathematics",  pct:83, ...BAR_COLORS[2] },
    { name:"Science",      pct:76, ...BAR_COLORS[3] },
    { name:"History",      pct:71, ...BAR_COLORS[4] },
  ].forEach(b => bars.push(b));

  const recent = [...S].slice(-5).reverse();

  return (
    <div className="page">
      {/* ── Stat Cards ── */}
      <div className="stats-grid">
        <StatCard color="blue"  val={S.length} label="Total Students"  sub="Across all classes"   chip={`${active} active`}   icon={<IcoUsers />} delay={0} />
        <StatCard color="cyan"  val={attPct}   label="Attendance Rate" sub="Weekly average"        chip="↑ 2% this month"      suffix="%" icon={<IcoCal />}   delay={80} />
        <StatCard color="amber" val={G.length} label="Grades Recorded" sub="Exams logged"          chip="This term"            icon={<IcoGrade />} delay={160} />
        <StatCard color="rose"  val={3}        label="Low Attendance"  sub="Need follow-up"        chip="Below 75%"            icon={<IcoWarn />}  delay={240} />
      </div>

      {/* ── Charts ── */}
      <div className="charts-row">
        {/* Bar chart */}
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">Subject Performance</div>
            <div className="card-subtitle">Average score across all recorded exams</div>
          </div>
          <div className="card-body">
            <div className="bar-list">
              {bars.map(b => (
                <div className="bar-row" key={b.name}>
                  <div className="bar-label">{b.name}</div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{
                      width: `${b.pct}%`,
                      background: `linear-gradient(90deg, ${b.bg}, ${b.color})`,
                    }}>
                      <div style={{ position:"absolute", right:0, top:0, bottom:0, width:8, borderRadius:4, background:b.color, filter:"blur(4px)" }} />
                    </div>
                  </div>
                  <div className="bar-pct" style={{ color:b.color }}>{b.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Donut chart */}
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">Attendance Split</div>
            <div className="card-subtitle">All-time distribution</div>
          </div>
          <div className="card-body">
            <div className="donut-wrap">
              <DonutChart present={pPresent} absent={pAbsent} late={pLate} />
              <div className="legend">
                <div className="leg-row">
                  <div className="leg-pip" style={{ background:"var(--emerald)", boxShadow:"0 0 6px var(--emerald)" }} />
                  <span className="leg-name">Present</span>
                  <span className="leg-val" style={{ color:"var(--emerald)" }}>{pPresent}%</span>
                </div>
                <div className="leg-row">
                  <div className="leg-pip" style={{ background:"var(--rose)" }} />
                  <span className="leg-name">Absent</span>
                  <span className="leg-val" style={{ color:"var(--rose)" }}>{pAbsent}%</span>
                </div>
                <div className="leg-row">
                  <div className="leg-pip" style={{ background:"var(--amber)" }} />
                  <span className="leg-name">Late</span>
                  <span className="leg-val" style={{ color:"var(--amber)" }}>{pLate}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Students Table ── */}
      <div className="table-card">
        <div className="table-top">
          <div className="table-top-title">Recent Enrolments</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Student</th><th>Roll No.</th><th>Class</th><th>Section</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map(s => (
              <tr key={s.id}>
                <td>
                  <span className="s-av">{s.fullName[0]}</span>
                  <strong>{s.fullName}</strong>
                </td>
                <td><span className="mono-tag">{s.rollNumber}</span></td>
                <td style={{ color:"var(--t2)" }}>{s.className}</td>
                <td style={{ color:"var(--t2)" }}>{s.section}</td>
                <td><StatusBadge status={s.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
