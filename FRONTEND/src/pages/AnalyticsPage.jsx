import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext.jsx";
import { DEMO_STUDENTS, DEMO_GRADES, DEMO_ATTENDANCE } from "../utils/demoData.js";

function gradeToNum(g=""){return{"A+":97,A:88,"B+":78,B:72,"C+":67,C:62,D:50,F:30}[g]??60;}

// ─── WORKING PIE CHART ────────────────────────────────────────
function PieChart({ excellent, atRisk }) {
  const total = excellent + atRisk;

  if (total === 0) {
    return (
      <div style={{textAlign:"center",padding:60,color:"var(--t3)"}}>
        No student data available
      </div>
    );
  }

  // If all excellent or all at-risk, draw full circle
  if (excellent === 0) {
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"16px 0"}}>
        <svg width={260} height={260} viewBox="0 0 260 260">
          <circle cx={130} cy={130} r={110} fill="#ef4444"/>
          <text x={130} y={125} textAnchor="middle" fill="white" fontSize={22} fontWeight={800} fontFamily="Outfit,sans-serif">At Risk</text>
          <text x={130} y={150} textAnchor="middle" fill="white" fontSize={18} fontWeight={700} fontFamily="Outfit,sans-serif">{atRisk}</text>
        </svg>
        <div style={{display:"flex",gap:20,marginTop:8}}>
          <span style={{display:"flex",alignItems:"center",gap:7,fontSize:13,color:"var(--t2)"}}>
            <span style={{width:13,height:13,borderRadius:2,background:"#22c55e",display:"inline-block"}}/>Excellent
          </span>
          <span style={{display:"flex",alignItems:"center",gap:7,fontSize:13,color:"var(--t2)"}}>
            <span style={{width:13,height:13,borderRadius:2,background:"#ef4444",display:"inline-block"}}/>At Risk
          </span>
        </div>
      </div>
    );
  }

  if (atRisk === 0) {
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"16px 0"}}>
        <svg width={260} height={260} viewBox="0 0 260 260">
          <circle cx={130} cy={130} r={110} fill="#22c55e"/>
          <text x={130} y={125} textAnchor="middle" fill="white" fontSize={22} fontWeight={800} fontFamily="Outfit,sans-serif">Excellent</text>
          <text x={130} y={150} textAnchor="middle" fill="white" fontSize={18} fontWeight={700} fontFamily="Outfit,sans-serif">{excellent}</text>
        </svg>
        <div style={{display:"flex",gap:20,marginTop:8}}>
          <span style={{display:"flex",alignItems:"center",gap:7,fontSize:13,color:"var(--t2)"}}>
            <span style={{width:13,height:13,borderRadius:2,background:"#22c55e",display:"inline-block"}}/>Excellent
          </span>
          <span style={{display:"flex",alignItems:"center",gap:7,fontSize:13,color:"var(--t2)"}}>
            <span style={{width:13,height:13,borderRadius:2,background:"#ef4444",display:"inline-block"}}/>At Risk
          </span>
        </div>
      </div>
    );
  }

  // Normal case — two slices
  const CX = 130, CY = 130, R = 110;
  const exAngle  = (excellent / total) * 2 * Math.PI;
  const START    = -Math.PI / 2; // start from top

  // Excellent slice: from START to START+exAngle
  const ex1x = CX + R * Math.cos(START);
  const ex1y = CY + R * Math.sin(START);
  const ex2x = CX + R * Math.cos(START + exAngle);
  const ex2y = CY + R * Math.sin(START + exAngle);
  const exLarge = excellent / total > 0.5 ? 1 : 0;

  // At Risk slice: from START+exAngle back to START
  const rk1x = ex2x, rk1y = ex2y;
  const rk2x = ex1x, rk2y = ex1y;
  const rkLarge = atRisk / total > 0.5 ? 1 : 0;

  // Label positions (inside the slice at 60% radius)
  const exMid  = START + exAngle / 2;
  const rkMid  = START + exAngle + (2 * Math.PI - exAngle) / 2;
  const exLblX = CX + R * 0.62 * Math.cos(exMid);
  const exLblY = CY + R * 0.62 * Math.sin(exMid);
  const rkLblX = CX + R * 0.62 * Math.cos(rkMid);
  const rkLblY = CY + R * 0.62 * Math.sin(rkMid);

  // Outside label positions
  const exOutX = CX + (R + 28) * Math.cos(exMid);
  const exOutY = CY + (R + 28) * Math.sin(exMid);
  const rkOutX = CX + (R + 28) * Math.cos(rkMid);
  const rkOutY = CY + (R + 28) * Math.sin(rkMid);

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"16px 0"}}>
      <svg width={300} height={300} viewBox="0 0 300 300">
        {/* Excellent slice — GREEN */}
        <path
          d={`M ${CX} ${CY} L ${ex1x} ${ex1y} A ${R} ${R} 0 ${exLarge} 1 ${ex2x} ${ex2y} Z`}
          fill="#22c55e"
          stroke="#0c1120"
          strokeWidth={2}
        />
        {/* At Risk slice — RED */}
        <path
          d={`M ${CX} ${CY} L ${rk1x} ${rk1y} A ${R} ${R} 0 ${rkLarge} 1 ${rk2x} ${rk2y} Z`}
          fill="#ef4444"
          stroke="#0c1120"
          strokeWidth={2}
        />

        {/* Count inside slice */}
        <text x={exLblX} y={exLblY} textAnchor="middle" dominantBaseline="middle"
          fill="white" fontSize={20} fontWeight={800} fontFamily="Outfit,sans-serif">
          {excellent}
        </text>
        <text x={rkLblX} y={rkLblY} textAnchor="middle" dominantBaseline="middle"
          fill="white" fontSize={20} fontWeight={800} fontFamily="Outfit,sans-serif">
          {atRisk}
        </text>

        {/* Outside labels */}
        <line x1={CX + R * 0.88 * Math.cos(exMid)} y1={CY + R * 0.88 * Math.sin(exMid)}
          x2={exOutX} y2={exOutY} stroke="#22c55e" strokeWidth={1.5}/>
        <text x={exOutX + (exOutX > CX ? 6 : -6)}
          y={exOutY} textAnchor={exOutX > CX ? "start" : "end"}
          dominantBaseline="middle" fill="#22c55e" fontSize={12} fontWeight={700}
          fontFamily="Outfit,sans-serif">
          Excellent: {excellent}
        </text>

        <line x1={CX + R * 0.88 * Math.cos(rkMid)} y1={CY + R * 0.88 * Math.sin(rkMid)}
          x2={rkOutX} y2={rkOutY} stroke="#ef4444" strokeWidth={1.5}/>
        <text x={rkOutX + (rkOutX > CX ? 6 : -6)}
          y={rkOutY} textAnchor={rkOutX > CX ? "start" : "end"}
          dominantBaseline="middle" fill="#ef4444" fontSize={12} fontWeight={700}
          fontFamily="Outfit,sans-serif">
          At Risk: {atRisk}
        </text>
      </svg>

      {/* Legend */}
      <div style={{display:"flex",gap:22,marginTop:4}}>
        <span style={{display:"flex",alignItems:"center",gap:7,fontSize:13,color:"var(--t2)"}}>
          <span style={{width:13,height:13,borderRadius:2,background:"#22c55e",display:"inline-block"}}/>Excellent
        </span>
        <span style={{display:"flex",alignItems:"center",gap:7,fontSize:13,color:"var(--t2)"}}>
          <span style={{width:13,height:13,borderRadius:2,background:"#ef4444",display:"inline-block"}}/>At Risk
        </span>
      </div>
    </div>
  );
}

// ─── BAR CHART ────────────────────────────────────────────────
function BarChart({ data }) {
  if (!data.length) return <div style={{padding:40,textAlign:"center",color:"var(--t3)"}}>No data</div>;
  const W=520, H=210, PL=38, PB=60, PT=10, PR=10;
  const cW=W-PL-PR, cH=H-PT-PB;
  const bGW=cW/data.length, bW=Math.min(20,bGW*0.3);
  return (
    <div style={{overflowX:"auto"}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{minWidth:300,display:"block"}}>
        {[0,25,50,75,100].map(v=>{
          const y=PT+cH-(v/100)*cH;
          return(<g key={v}>
            <line x1={PL} y1={y} x2={PL+cW} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth={0.8}/>
            <text x={PL-5} y={y+4} textAnchor="end" fill="var(--t3)" fontSize={9} fontFamily="Outfit,sans-serif">{v}</text>
          </g>);
        })}
        {data.map((d,i)=>{
          const gx=PL+i*bGW+bGW/2;
          const aH=(d.att/100)*cH, grH=(d.grade/100)*cH;
          return(<g key={i}>
            <rect x={gx-bW-2} y={PT+cH-aH}  width={bW} height={aH}  fill="#4f8ef7" rx={3} opacity={0.88}/>
            <rect x={gx+2}    y={PT+cH-grH} width={bW} height={grH} fill="#22c55e" rx={3} opacity={0.88}/>
            <text x={gx} y={H-PB+14} textAnchor="middle" fill="var(--t2)" fontSize={8} fontFamily="Outfit,sans-serif">{d.name.slice(0,10)}</text>
            <text x={gx} y={H-PB+26} textAnchor="middle" fill="var(--t3)" fontSize={7} fontFamily="Outfit,sans-serif">({i+1})</text>
          </g>);
        })}
        <line x1={PL} y1={PT+cH} x2={PL+cW} y2={PT+cH} stroke="rgba(255,255,255,0.1)" strokeWidth={0.8}/>
      </svg>
      <div style={{display:"flex",gap:18,justifyContent:"center",marginTop:8}}>
        <span style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"var(--t2)"}}>
          <span style={{width:10,height:10,background:"#4f8ef7",borderRadius:2,display:"inline-block"}}/>Attendance %
        </span>
        <span style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"var(--t2)"}}>
          <span style={{width:10,height:10,background:"#22c55e",borderRadius:2,display:"inline-block"}}/>Avg Grade %
        </span>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────
export default function AnalyticsPage() {
  const {students,grades,attendance} = useApp();
  const [sel, setSel] = useState("");
  const S = students.length   ? students   : DEMO_STUDENTS;
  const G = grades.length     ? grades     : DEMO_GRADES;
  const A = attendance.length ? attendance : DEMO_ATTENDANCE;

  const stats = useMemo(()=>S.map(st=>{
    const sg = G.filter(g=>g.student?.id===st.id||g.student?.fullName===st.fullName);
    const sa = A.filter(a=>a.student?.id===st.id||a.student?.fullName===st.fullName);
    const avg = sg.length ? Math.round(sg.reduce((a,g)=>a+gradeToNum(g.grade),0)/sg.length) : 0;
    const att = sa.length ? Math.round((sa.filter(a=>a.status==="PRESENT").length/sa.length)*100) : 0;
    const status = avg>=85&&att>=80?"Excellent":avg>=70&&att>=70?"Good":avg>=55?"Average":"At Risk";
    return {...st,avg,att,status};
  }),[S,G,A]);

  const excellent = stats.filter(s=>s.status==="Excellent").length;
  const atRisk    = stats.filter(s=>s.status==="At Risk").length;
  const barData   = stats.slice(0,10).map(s=>({name:s.fullName,att:s.att,grade:s.avg}));
  const attAvg    = A.length ? Math.round(A.filter(a=>a.status==="PRESENT").length/A.length*100) : 0;

  const subjGrades = useMemo(()=>{
    const src = sel ? G.filter(g=>String(g.student?.id)===sel) : G;
    const map = {};
    src.forEach(g=>{if(!map[g.subject])map[g.subject]=[];map[g.subject].push(gradeToNum(g.grade));});
    return Object.entries(map).map(([s,v])=>({s,avg:Math.round(v.reduce((a,b)=>a+b,0)/v.length)})).sort((a,b)=>b.avg-a.avg);
  },[sel,G]);

  const COLORS=["var(--blue)","var(--emerald)","var(--violet)","var(--amber)","var(--cyan)","var(--rose)"];
  const sColor={Excellent:"#22c55e",Good:"var(--blue)",Average:"var(--amber)","At Risk":"#ef4444"};
  const sBg   ={Excellent:"rgba(34,197,94,0.12)",Good:"var(--blue-g)",Average:"var(--amb-g)","At Risk":"rgba(239,68,68,0.12)"};

  return (
    <div className="page">
      {/* Stat chips */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
        {[
          {label:"Total Students", val:S.length,   color:"var(--blue)"},
          {label:"Excellent",      val:excellent,  color:"#22c55e"},
          {label:"At Risk",        val:atRisk,     color:"#ef4444"},
          {label:"Avg Attendance", val:attAvg+"%", color:"var(--cyan)"},
        ].map(({label,val,color})=>(
          <div key={label} style={{borderRadius:16,padding:"18px 20px",background:"var(--s1)",
            border:"1px solid var(--b1)",borderLeft:`3px solid ${color}`}}>
            <div style={{fontSize:32,fontWeight:900,color,letterSpacing:"-1px"}}>{val}</div>
            <div style={{fontSize:11,fontWeight:600,textTransform:"uppercase",
              letterSpacing:"0.07em",color:"var(--t3)",marginTop:4}}>{label}</div>
          </div>
        ))}
      </div>

      {/* Pie + Bar */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1.6fr",gap:14,marginBottom:14}}>
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">Performance Distribution</div>
            <div className="card-subtitle">Excellent vs At Risk students</div>
          </div>
          <div className="card-body">
            <PieChart excellent={excellent} atRisk={atRisk}/>
          </div>
        </div>
        <div className="glass-card">
          <div className="card-header">
            <div className="card-title">Attendance vs Grade (Top 10)</div>
            <div className="card-subtitle">Blue = Attendance · Green = Grade</div>
          </div>
          <div className="card-body">
            <BarChart data={barData}/>
          </div>
        </div>
      </div>

      {/* Subject-wise */}
      <div className="glass-card" style={{marginBottom:14}}>
        <div className="card-header" style={{display:"flex",justifyContent:"space-between",
          alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
          <div>
            <div className="card-title">Subject-wise Performance</div>
            <div className="card-subtitle">Average score per subject</div>
          </div>
          <select value={sel} onChange={e=>setSel(e.target.value)}
            style={{background:"var(--s2)",border:"1px solid var(--b2)",borderRadius:8,
              color:"var(--t1)",padding:"8px 14px",fontSize:13,fontFamily:"Outfit,sans-serif",
              outline:"none",minWidth:200,cursor:"pointer"}}>
            <option value="">— All Students —</option>
            {S.map(st=><option key={st.id} value={st.id}>{st.fullName}</option>)}
          </select>
        </div>
        <div className="card-body">
          {subjGrades.length===0
            ? <div style={{textAlign:"center",padding:30,color:"var(--t3)",fontSize:13}}>
                Select a student to see subject averages.
              </div>
            : <div style={{display:"flex",flexDirection:"column",gap:13}}>
                {subjGrades.map(({s,avg},i)=>(
                  <div key={s} style={{display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:120,fontSize:12,color:"var(--t2)",fontWeight:500,
                      whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s}</div>
                    <div style={{flex:1,height:8,background:"rgba(255,255,255,0.06)",borderRadius:4,overflow:"hidden"}}>
                      <div style={{width:`${avg}%`,height:"100%",borderRadius:4,
                        background:COLORS[i%COLORS.length],
                        boxShadow:`0 0 8px ${COLORS[i%COLORS.length]}50`}}/>
                    </div>
                    <div style={{width:40,fontSize:12,fontWeight:700,textAlign:"right",
                      color:COLORS[i%COLORS.length],fontFamily:"JetBrains Mono,monospace"}}>{avg}%</div>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      {/* Summary table */}
      <div className="table-card">
        <div className="table-top">
          <div className="table-top-title">All Students — Summary</div>
          <span style={{fontSize:12,color:"var(--t3)"}}>{S.length} students</span>
        </div>
        <table>
          <thead><tr><th>Student</th><th>Avg Grade</th><th>Attendance %</th><th>Status</th></tr></thead>
          <tbody>
            {stats.map(st=>(
              <tr key={st.id}>
                <td><span className="s-av">{st.fullName[0]}</span><strong>{st.fullName}</strong></td>
                <td>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:90,height:6,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden"}}>
                      <div style={{width:`${st.avg}%`,height:"100%",borderRadius:3,
                        background:st.avg>=85?"#22c55e":st.avg>=70?"#4f8ef7":st.avg>=55?"#fbbf24":"#ef4444"}}/>
                    </div>
                    <span style={{fontSize:12,fontWeight:700,fontFamily:"JetBrains Mono,monospace",
                      color:st.avg>=85?"#22c55e":st.avg>=70?"#4f8ef7":st.avg>=55?"#fbbf24":"#ef4444"}}>{st.avg}%</span>
                  </div>
                </td>
                <td>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:90,height:6,background:"rgba(255,255,255,0.06)",borderRadius:3,overflow:"hidden"}}>
                      <div style={{width:`${st.att}%`,height:"100%",borderRadius:3,
                        background:st.att>=80?"#22c55e":st.att>=60?"#fbbf24":"#ef4444"}}/>
                    </div>
                    <span style={{fontSize:12,fontWeight:700,fontFamily:"JetBrains Mono,monospace",
                      color:st.att>=80?"#22c55e":st.att>=60?"#fbbf24":"#ef4444"}}>{st.att}%</span>
                  </div>
                </td>
                <td>
                  <span style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,
                    color:sColor[st.status],background:sBg[st.status],
                    border:`1px solid ${sColor[st.status]}40`}}>{st.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
