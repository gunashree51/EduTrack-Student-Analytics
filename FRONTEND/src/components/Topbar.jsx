import { useApp } from "../context/AppContext.jsx";
import { IcoRefresh, IcoPlus, IcoBell } from "./Icons.jsx";

const TITLES     = {dashboard:"Dashboard",students:"Students",attendance:"Attendance",grades:"Grades",analytics:"Analytics",fees:"Fees"};
const ADD_LABELS = {dashboard:"New Report",students:"Add Student",attendance:"Mark Attendance",grades:"Add Grade",analytics:"Export",fees:"Add Fee"};

export default function Topbar({onAdd}){
  const {page,loadAll}=useApp();
  return(
    <div className="topbar">
      <div>
        <div className="tb-title">{TITLES[page]||"EduTrack"}</div>
        <div className="tb-date">{new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
      </div>
      <div className="tb-right">
        <button className="notif-btn" aria-label="Notifications"><IcoBell/><div className="notif-dot"/></button>
        <button className="btn btn-ghost btn-sm" onClick={loadAll}><IcoRefresh/> Refresh</button>
        <button className="btn btn-primary btn-sm" onClick={onAdd}><IcoPlus/> {ADD_LABELS[page]||"New"}</button>
      </div>
    </div>
  );
}
