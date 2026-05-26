import { useEffect, useState } from 'react';

export default function ServerUnavailableBanner() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handler = () => {
            setVisible(true);
            setTimeout(() => setVisible(false), 60000);
        };
        window.addEventListener('server-unavailable', handler);
        return () => window.removeEventListener('server-unavailable', handler);
    }, []);

    if (!visible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[9999] bg-gray-800 text-gray-300 text-xs px-4 py-4 rounded-lg shadow-lg flex items-center gap-2.5 max-w-xs">
            <span className="text-gray-400">⚠</span>
            <p className="leading-snug">
                Servidor no disponible.{' '}
                <button
                    onClick={() => window.location.reload()}
                    className="underline hover:text-white cursor-pointer"
                >
                    Recargar
                </button>
            </p>
        </div>
    );
}
