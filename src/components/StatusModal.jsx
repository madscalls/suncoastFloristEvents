import { createPortal } from "react-dom";
import "./StatusModal.css";

export default function StatusModal({ type, onClose }) {
  const isSuccess = type === "success";

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-card ${isSuccess ? "modal-success" : "modal-error"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-icon">{isSuccess ? "🌸" : "🥀"}</div>
        <h2 className="modal-title">
          {isSuccess ? "Request Received!" : "Something Went Wrong"}
        </h2>
        <p className="modal-message">
          {isSuccess
            ? "Thank you! We've received your submission and will be in touch soon."
            : "We weren't able to send your request. Please try again or call us directly at (941) 365-6407."}
        </p>
        <button className="modal-btn" onClick={onClose}>
          {isSuccess ? "Back to Home" : "Try Again"}
        </button>
      </div>
    </div>,
    document.body,
  );
}
