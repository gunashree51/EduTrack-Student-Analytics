import { IcoClose } from "./Icons.jsx";

export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-bg" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onClose}><IcoClose /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
