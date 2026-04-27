import { useApp } from "../context/AppContext.jsx";
import { IcoDash, IcoUsers, IcoCal, IcoGrade, IcoGradCap, IcoLogout } from "./Icons.jsx";

const IcoAnalytics = () => <svg width="15" height="15" fill="none" viewBox="0 0 20 20"><path d="M3 17V9M7 17V5M11 17v-6M15 17V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const IcoFees      = () => <svg width="15" height="15" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4"/><path d="M10 6v1.5M10 12.5V14M7.5 8.5a2.5 2 0 015 0c0 1.5-2.5 2-2.5 3a2.5 2 0 005 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;

const NAV = [
  { id:"dashboard",  label:"Dashboard",  Icon:IcoDash,      badge:null },
  { id:"students",   label:"Students",   Icon:IcoUsers,     badge:"students" },
  { id:"attendance", label:"Attendance", Icon:IcoCal,       badge:"attendance" },
  { id:"grades",     label:"Grades",     Icon:IcoGrade,     badge:"grades" },
  { id:"analytics",  label:"Analytics",  Icon:IcoAnalytics, badge:null },
  { id:"fees",       label:"Fees",       Icon:IcoFees,      badge:null },
];

export default function Sidebar(){
  const { page, setPage, user, logout, students, attendance, grades } = useApp();
  const counts = { students:students.length||null, attendance:attendance.length||null, grades:grades.length||null };
  return(
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-brand-gem"><IcoGradCap size={18}/></div>
        <div>
          <div className="sb-brand-name">EduTrack</div>
          <div className="sb-brand-tag">Analytics Platform</div>
        </div>
      </div>
      <nav className="sb-nav">
        <div className="sb-section">Navigation</div>
        {NAV.map(({id,label,Icon,badge})=>(
          <div key={id} className={`sb-item${page===id?" active":""}`} onClick={()=>setPage(id)}>
            <Icon/>{label}
            {badge&&counts[badge]?<span className="sb-badge">{counts[badge]}</span>:null}
          </div>
        ))}
      </nav>
      <div className="sb-footer">
        <div className="sb-user">
          <div className="sb-avatar">{(user?.fullName||"U")[0].toUpperCase()}</div>
          <div style={{flex:1,minWidth:0}}>
            <div className="sb-uname">{user?.fullName}</div>
            <div className="sb-urole">{user?.role}</div>
          </div>
          <button className="sb-logout" onClick={logout} title="Sign out"><IcoLogout/></button>
        </div>
      </div>
    </aside>
  );
}
