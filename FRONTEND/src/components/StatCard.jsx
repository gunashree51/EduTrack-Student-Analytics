import { useCounter } from "../hooks/useCounter.js";

export default function StatCard({ color, val, suffix="", label, sub, chip, icon, delay=0 }) {
  const animated = useCounter(Number(val)||0);
  const colors = {
    blue:    { bg:"linear-gradient(135deg,#0c1a2e,#0d1b30)", glow:"#4f8ef7", ic:"var(--blue-g)",  cv:"var(--blue)",    chip:"var(--em-g)", cc:"var(--emerald)" },
    cyan:    { bg:"linear-gradient(135deg,#0b1e20,#0c1f21)", glow:"#22d3ee", ic:"var(--cyan-g)",  cv:"var(--cyan)",    chip:"var(--em-g)", cc:"var(--emerald)" },
    amber:   { bg:"linear-gradient(135deg,#1c1505,#1c1607)", glow:"#fbbf24", ic:"var(--amb-g)",   cv:"var(--amber)",   chip:"var(--amb-g)",cc:"var(--amber)" },
    rose:    { bg:"linear-gradient(135deg,#1a0b0f,#1c0b11)", glow:"#fb7185", ic:"var(--rose-g)",  cv:"var(--rose)",    chip:"var(--rose-g)",cc:"var(--rose)" },
  };
  const c = colors[color]||colors.blue;
  return (
    <div className="stat-card" style={{ background:c.bg, animationDelay:`${delay}ms` }}>
      <div className="stat-glow" style={{ background:c.glow }} />
      <div className="stat-top">
        <div className="stat-icon" style={{ background:c.ic, color:c.cv }}>{icon}</div>
        <span className="stat-chip" style={{ background:c.chip, color:c.cc }}>{chip}</span>
      </div>
      <div className="stat-val" style={{ color:c.cv, textShadow:`0 0 32px ${c.glow}60` }}>
        {animated}{suffix}
      </div>
      <div className="stat-lbl">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}
