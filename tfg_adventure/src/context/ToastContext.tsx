import {createContext, type ReactNode, useCallback, useState} from 'react';

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type?: 'success' | 'error' | 'info', duration?: number) => void;
    removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({children}: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [lastToastTime, setLastToastTime] = useState(0);

    const addToast = useCallback(
        (message: string, type: 'success' | 'error' | 'info' = 'success', duration = 3000) => {
            const now = Date.now();
            const timeSinceLastToast = now - lastToastTime;

            if (timeSinceLastToast < 3000) {
                return;
            }

            setLastToastTime(now);
            const id = `${Date.now()}-${Math.random()}`;

            setToasts(prev => [...prev, {id, message, type}]);

            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        },
        [lastToastTime]
    );

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{toasts, addToast, removeToast}}>
            {children}
        </ToastContext.Provider>
    );
}
