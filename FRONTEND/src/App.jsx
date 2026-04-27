import { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import Sidebar        from "./components/Sidebar.jsx";
import Topbar         from "./components/Topbar.jsx";
import ToastStack     from "./components/ToastStack.jsx";
import AuthPage       from "./pages/AuthPage.jsx";
import DashboardPage  from "./pages/DashboardPage.jsx";
import StudentsPage   from "./pages/StudentsPage.jsx";
import AttendancePage from "./pages/AttendancePage.jsx";
import GradesPage     from "./pages/GradesPage.jsx";
import AnalyticsPage  from "./pages/AnalyticsPage.jsx";
import FeesPage       from "./pages/FeesPage.jsx";

function AppShell(){
  const {token,page}=useApp();
  const [addTrigger,setAddTrigger]=useState(false);
  if(!token) return <AuthPage/>;
  return(
    <div className="app">
      <Sidebar/>
      <div className="main">
        <Topbar onAdd={()=>setAddTrigger(true)}/>
        <div className="scroll">
          {page==="dashboard"  && <DashboardPage/>}
          {page==="students"   && <StudentsPage triggerAdd={addTrigger} onAddDone={()=>setAddTrigger(false)}/>}
          {page==="attendance" && <AttendancePage/>}
          {page==="grades"     && <GradesPage/>}
          {page==="analytics"  && <AnalyticsPage/>}
          {page==="fees"       && <FeesPage/>}
        </div>
      </div>
      <ToastStack/>
    </div>
  );
}

export default function App(){
  return <AppProvider><AppShell/></AppProvider>;
}
