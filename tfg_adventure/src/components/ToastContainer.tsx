import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

export default function ToastContainer() {
    const context = useContext(ToastContext);
    if (!context) return null;

    const { toasts, removeToast } = context;

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`
            animate-slide-in-right
            pointer-events-auto
            px-6 py-3 rounded-lg
            text-white text-sm font-medium
            shadow-lg
            flex items-center gap-3
            backdrop-blur-sm
            ${toast.type === 'success'
                            ? 'bg-green-600/90 border border-green-500/50'
                            : toast.type === 'error'
                                ? 'bg-red-600/90 border border-red-500/50'
                                : 'bg-blue-600/90 border border-blue-500/50'
                        }
          `}
                >
                    <span>
                        {toast.type === 'success' && '✓'}
                        {toast.type === 'error' && '✕'}
                        {toast.type === 'info' && 'ℹ'}
                    </span>
                    <span>{toast.message}</span>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="ml-2 text-white hover:text-gray-200 bg-transparent border-none cursor-pointer p-0 transition-colors"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}
