import React from 'react';
import '../css/Toast.css';

/**
 * Toast notification renderer.
 *
 * Props:
 *   toasts   → [{ id, message, type }]  from AppContext
 *   onDismiss → (id) => void
 */
function Toast({ toasts, onDismiss }) {
    if (!toasts || toasts.length === 0) return null;

    return (
        <div className="toast-container" role="status" aria-live="polite">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`toast toast--${toast.type || 'success'}`}
                >
                    <span className="toast__icon">
                        {toast.type === 'error' ? '⚠️' : '✅'}
                    </span>
                    <p className="toast__message">{toast.message}</p>
                    <button
                        className="toast__close"
                        onClick={() => onDismiss(toast.id)}
                        aria-label="Kapat"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}

export default Toast;
