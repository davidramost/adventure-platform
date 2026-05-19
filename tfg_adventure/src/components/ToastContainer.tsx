import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

export default function ToastContainer() {
    const context = useContext(ToastContext);
    if (!context) return null;

    const { toasts, removeToast } = context;

    return (
        <div className="fixed top-6 left-1/2 z-50 flex flex-col gap-3 pointer-events-none" style={{ transform: 'translateX(-50%)' }}>
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`
                        animate-slide-in-down
                        pointer-events-auto
                        min-w-72 max-w-sm
                        px-5 py-4 rounded-2xl
                        text-white text-sm font-medium
                        shadow-xl
                        flex items-center gap-3
                        ${toast.type === 'success'
                            ? 'bg-green-600'
                            : toast.type === 'error'
                                ? 'bg-red-600'
                                : 'bg-blue-600'
                        }
                    `}
                >
                    <span className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shrink-0 text-xs font-bold leading-none">
                        {toast.type === 'success' && '✓'}
                        {toast.type === 'error' && '!'}
                        {toast.type === 'info' && 'i'}
                    </span>
                    <span className="flex-1">{toast.message}</span>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="text-white/80 hover:text-white bg-transparent border-none cursor-pointer p-0 text-base leading-none transition-colors shrink-0"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}
