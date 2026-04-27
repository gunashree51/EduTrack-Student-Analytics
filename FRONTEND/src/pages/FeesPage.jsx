import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext.jsx";
import Modal from "../components/Modal.jsx";
import { DEMO_STUDENTS } from "../utils/demoData.js";

const DEMO_FEES = [
  {id:1,studentId:1,studentName:"Arjun Sharma",  feeType:"Tuition",amount:15000,paid:15000,dueDate:"2024-01-15",status:"Paid",   month:"January"},
  {id:2,studentId:2,studentName:"Priya Patel",   feeType:"Tuition",amount:15000,paid:15000,dueDate:"2024-01-15",status:"Paid",   month:"January"},
  {id:3,studentId:3,studentName:"Rohit Verma",   feeType:"Tuition",amount:15000,paid:0,    dueDate:"2024-01-15",status:"Unpaid", month:"January"},
  {id:4,studentId:4,studentName:"Sneha Gupta",   feeType:"Exam",   amount:5000, paid:5000, dueDate:"2024-02-10",status:"Paid",   month:"February"},
  {id:5,studentId:5,studentName:"Kavya Nair",    feeType:"Tuition",amount:15000,paid:8000, dueDate:"2024-01-15",status:"Partial",month:"January"},
  {id:6,studentId:6,studentName:"Aarav Mehta",   feeType:"Library",amount:2000, paid:2000, dueDate:"2024-01-20",status:"Paid",   month:"January"},
  {id:7,studentId:7,studentName:"Zara Khan",     feeType:"Tuition",amount:15000,paid:0,    dueDate:"2024-02-15",status:"Unpaid", month:"February"},
  {id:8,studentId:8,studentName:"Dev Sharma",    feeType:"Sports", amount:3000, paid:3000, dueDate:"2024-01-25",status:"Paid",   month:"January"},
];

const STATUS_COLOR = {
  Paid:    {color:"#34d399",bg:"rgba(52,211,153,0.12)",border:"rgba(52,211,153,0.25)"},
  Unpaid:  {color:"#fb7185",bg:"rgba(251,113,133,0.12)",border:"rgba(251,113,133,0.25)"},
  Partial: {color:"#fbbf24",bg:"rgba(251,191,36,0.12)",border:"rgba(251,191,36,0.25)"},
  Overdue: {color:"#f97316",bg:"rgba(249,115,22,0.12)",border:"rgba(249,115,22,0.25)"},
};

function FeeBadge({status}){
  const c=STATUS_COLOR[status]||STATUS_COLOR.Unpaid;
  return(
    <span style={{padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,
      color:c.color,background:c.bg,border:`1px solid ${c.border}`}}>{status}</span>
  );
}

export default function FeesPage(){
  const {students} = useApp();
  const [fees, setFees] = useState(DEMO_FEES);
  const [modal, setModal] = useState(null);
  const [filter, setFilter] = useState("All");
  const S = students.length ? students : DEMO_STUDENTS;

  const totalAmount  = fees.reduce((a,f)=>a+f.amount,0);
  const totalPaid    = fees.reduce((a,f)=>a+f.paid,0);
  const totalPending = totalAmount - totalPaid;
  const paidCount    = fees.filter(f=>f.status==="Paid").length;
  const unpaidCount  = fees.filter(f=>f.status==="Unpaid").length;
  const partialCount = fees.filter(f=>f.status==="Partial").length;

  const filtered = filter==="All" ? fees : fees.filter(f=>f.status===filter);

  const handleSave = (data) => {
    if(data.id){
      setFees(p=>p.map(f=>f.id===data.id?data:f));
    } else {
      const student = S.find(s=>String(s.id)===String(data.studentId));
      setFees(p=>[...p,{
        ...data,
        id: Date.now(),
        studentName: student?.fullName || "Unknown",
        status: Number(data.paid)>=Number(data.amount)?"Paid":
                Number(data.paid)>0?"Partial":"Unpaid",
      }]);
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    if(confirm("Delete this fee record?")) setFees(p=>p.filter(f=>f.id!==id));
  };

  const collectFee = (id) => {
    setFees(p=>p.map(f=>f.id===id?{...f,paid:f.amount,status:"Paid"}:f));
  };

  return(
    <div className="page">

      {/* Summary chips */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
        {[
          {label:"Total Fees",      val:"₹"+totalAmount.toLocaleString(),  color:"var(--blue)"},
          {label:"Collected",       val:"₹"+totalPaid.toLocaleString(),    color:"var(--emerald)"},
          {label:"Pending",         val:"₹"+totalPending.toLocaleString(), color:"var(--rose)"},
          {label:"Collection Rate", val:Math.round((totalPaid/totalAmount||0)*100)+"%", color:"var(--amber)"},
        ].map(({label,val,color})=>(
          <div key={label} style={{borderRadius:16,padding:"18px 20px",background:"var(--s1)",
            border:"1px solid var(--b1)",borderLeft:`3px solid ${color}`}}>
            <div style={{fontSize:26,fontWeight:900,color,letterSpacing:"-0.5px"}}>{val}</div>
            <div style={{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",
              color:"var(--t3)",marginTop:4}}>{label}</div>
          </div>
        ))}
      </div>

      {/* Status summary row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:22}}>
        {[
          {label:"Paid",    count:paidCount,    color:"var(--emerald)", bg:"var(--em-g)"},
          {label:"Partial", count:partialCount, color:"var(--amber)",   bg:"var(--amb-g)"},
          {label:"Unpaid",  count:unpaidCount,  color:"var(--rose)",    bg:"var(--rose-g)"},
        ].map(({label,count,color,bg})=>(
          <div key={label} style={{borderRadius:14,padding:"16px 20px",background:bg,
            border:`1px solid ${color}30`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:28,fontWeight:900,color}}>{count}</div>
              <div style={{fontSize:11,color,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em",marginTop:2}}>{label} Students</div>
            </div>
            <div style={{fontSize:32,opacity:0.4}}>
              {label==="Paid"?"✅":label==="Partial"?"⏳":"❌"}
            </div>
          </div>
        ))}
      </div>

      {/* Collection progress bar */}
      <div className="glass-card" style={{marginBottom:14}}>
        <div className="card-header">
          <div className="card-title">Collection Progress</div>
          <div className="card-subtitle">₹{totalPaid.toLocaleString()} collected of ₹{totalAmount.toLocaleString()}</div>
        </div>
        <div className="card-body">
          <div style={{height:18,background:"rgba(255,255,255,0.06)",borderRadius:9,overflow:"hidden",position:"relative"}}>
            <div style={{width:`${Math.round((totalPaid/totalAmount||0)*100)}%`,
              height:"100%",background:"linear-gradient(90deg,var(--blue),var(--emerald))",
              borderRadius:9,transition:"width 0.8s ease"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
            <span style={{fontSize:12,color:"var(--t3)"}}>0%</span>
            <span style={{fontSize:13,fontWeight:700,color:"var(--emerald)"}}>
              {Math.round((totalPaid/totalAmount||0)*100)}% Collected
            </span>
            <span style={{fontSize:12,color:"var(--t3)"}}>100%</span>
          </div>
        </div>
      </div>

      {/* Fee records table */}
      <div className="table-card">
        <div className="table-top">
          <div className="table-top-title">Fee Records</div>
          <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
            {/* Filter buttons */}
            <div style={{display:"flex",gap:6}}>
              {["All","Paid","Partial","Unpaid"].map(f=>(
                <button key={f} onClick={()=>setFilter(f)}
                  style={{padding:"5px 12px",borderRadius:7,fontSize:11,fontWeight:600,
                    cursor:"pointer",border:"1px solid var(--b2)",fontFamily:"Outfit,sans-serif",
                    background:filter===f?"var(--blue)":"transparent",
                    color:filter===f?"white":"var(--t2)"}}>
                  {f}
                </button>
              ))}
            </div>
            <button className="btn btn-primary btn-sm" onClick={()=>setModal({})}>
              + Add Fee
            </button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Fee Type</th>
              <th>Amount</th>
              <th>Paid</th>
              <th>Due Date</th>
              <th>Month</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(f=>(
              <tr key={f.id}>
                <td><span className="s-av">{f.studentName[0]}</span><strong>{f.studentName}</strong></td>
                <td>
                  <span style={{padding:"2px 8px",borderRadius:5,fontSize:11,fontWeight:600,
                    background:"var(--blue-g)",color:"var(--blue)"}}>
                    {f.feeType}
                  </span>
                </td>
                <td style={{fontFamily:"JetBrains Mono,monospace",fontSize:13,fontWeight:700,color:"var(--t1)"}}>
                  ₹{f.amount.toLocaleString()}
                </td>
                <td style={{fontFamily:"JetBrains Mono,monospace",fontSize:13,
                  color:f.paid>=f.amount?"var(--emerald)":f.paid>0?"var(--amber)":"var(--rose)"}}>
                  ₹{f.paid.toLocaleString()}
                </td>
                <td style={{color:"var(--t2)",fontSize:12,fontFamily:"JetBrains Mono,monospace"}}>{f.dueDate}</td>
                <td style={{color:"var(--t2)",fontSize:12}}>{f.month}</td>
                <td><FeeBadge status={f.status}/></td>
                <td>
                  <div className="btn-row">
                    {f.status!=="Paid"&&(
                      <button className="btn btn-sm"
                        style={{background:"var(--em-g)",color:"var(--emerald)",border:"1px solid rgba(52,211,153,0.25)",
                          padding:"5px 10px",fontSize:11,fontWeight:600,borderRadius:7,cursor:"pointer",fontFamily:"Outfit,sans-serif"}}
                        onClick={()=>collectFee(f.id)}>
                        Collect
                      </button>
                    )}
                    <button className="btn btn-sm btn-edit" onClick={()=>setModal(f)}>Edit</button>
                    <button className="btn btn-sm btn-del"  onClick={()=>handleDelete(f.id)}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length===0&&(
              <tr><td colSpan={8}>
                <div className="empty-state">
                  <div className="empty-icon">💰</div>
                  <div className="empty-title">No fee records</div>
                  <div className="empty-sub">Add your first fee record</div>
                </div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal!==null&&(
        <FeeModal fee={modal} students={S} onSave={handleSave} onClose={()=>setModal(null)}/>
      )}
    </div>
  );
}

function FeeModal({fee,students,onSave,onClose}){
  const isEdit=!!fee?.id;
  const [f,setF]=useState({
    studentId:"",feeType:"Tuition",amount:"",paid:"0",
    dueDate:new Date().toISOString().split("T")[0],month:"January",
    ...(isEdit?fee:{})
  });
  const s=k=>e=>setF(p=>({...p,[k]:e.target.value}));
  return(
    <Modal title={isEdit?"Edit Fee Record":"Add Fee Record"} onClose={onClose}>
      <div className="form-grid">
        <div className="form-group form-full">
          <label className="form-label">Student *</label>
          <select className="form-select" value={f.studentId} onChange={s("studentId")}>
            <option value="">Select student…</option>
            {students.map(st=><option key={st.id} value={st.id}>{st.fullName}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Fee Type *</label>
          <select className="form-select" value={f.feeType} onChange={s("feeType")}>
            {["Tuition","Exam","Library","Sports","Transport","Hostel","Other"].map(t=>(
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Month *</label>
          <select className="form-select" value={f.month} onChange={s("month")}>
            {["January","February","March","April","May","June","July","August","September","October","November","December"].map(m=>(
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Total Amount (₹) *</label>
          <input className="form-input" type="number" value={f.amount} onChange={s("amount")} placeholder="15000"/>
        </div>
        <div className="form-group">
          <label className="form-label">Amount Paid (₹) *</label>
          <input className="form-input" type="number" value={f.paid} onChange={s("paid")} placeholder="0"/>
        </div>
        <div className="form-group form-full">
          <label className="form-label">Due Date *</label>
          <input className="form-input" type="date" value={f.dueDate} onChange={s("dueDate")}/>
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={()=>{
          const paid=Number(f.paid||0), amount=Number(f.amount||0);
          const status=paid>=amount&&amount>0?"Paid":paid>0?"Partial":"Unpaid";
          const student=students.find(st=>String(st.id)===String(f.studentId));
          onSave({...f,paid,amount,status,studentName:student?.fullName||f.studentName||""});
        }}>
          {isEdit?"Save Changes":"Add Fee Record"}
        </button>
      </div>
    </Modal>
  );
}
