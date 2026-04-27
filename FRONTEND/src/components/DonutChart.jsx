export default function DonutChart({ present=79, absent=15, late=6 }) {
  const r = 52, cx = 64, cy = 64, circ = 2 * Math.PI * r;
  const pD = (present/100)*circ, aD = (absent/100)*circ, lD = (late/100)*circ;
  return (
    <div className="donut-frame" style={{ width:128, height:128 }}>
      <svg width="128" height="128" viewBox="0 0 128 128" style={{ transform:"rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="12"/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--emerald)" strokeWidth="12"
          strokeDasharray={`${pD} ${circ-pD}`} strokeLinecap="round"
          style={{ filter:"drop-shadow(0 0 6px var(--emerald))" }}/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--rose)" strokeWidth="12"
          strokeDasharray={`${aD} ${circ-aD}`} strokeDashoffset={-pD} strokeLinecap="round"/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--amber)" strokeWidth="12"
          strokeDasharray={`${lD} ${circ-lD}`} strokeDashoffset={-(pD+aD)} strokeLinecap="round"/>
      </svg>
      <div className="donut-center">
        <div className="donut-val" style={{ color:"var(--emerald)", textShadow:"0 0 20px var(--emerald)" }}>{present}%</div>
        <div className="donut-lbl">Present</div>
      </div>
    </div>
  );
}
