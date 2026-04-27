import { useApp } from "../context/AppContext.jsx";

export default function ToastStack() {
  const { toasts } = useApp();
  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <div className="toast" key={t.id}>
          <div className="toast-dot" style={{
            background: t.type==="error" ? "var(--rose)"
              : t.type==="info" ? "var(--blue)"
              : "var(--emerald)",
            boxShadow: `0 0 8px ${t.type==="error" ? "var(--rose)" : t.type==="info" ? "var(--blue)" : "var(--emerald)"}`,
          }} />
          {t.msg}
        </div>
      ))}
    </div>
  );
}
