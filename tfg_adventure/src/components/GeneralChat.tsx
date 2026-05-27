import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGeneralMessages, sendGeneralMessage } from '../services/mensajeService';
import type { Mensaje } from '../types';

function formatTime(fechaHora: string): string {
    const date = new Date(fechaHora);
    date.setHours(date.getHours() + 2);
    const now = new Date();
    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();

    const hhmm = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    if (isToday) return `hoy a las ${hhmm}`;

    const ddmm = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    return `${ddmm} a las ${hhmm}`;
}

export default function GeneralChat() {
    const { usuario } = useAuth();
    const [messages, setMessages] = useState<Mensaje[]>([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const isAtBottomRef = useRef(true);
    const prevMessagesLengthRef = useRef(0);

    const isAtBottom = useCallback(() => {
        const el = messagesContainerRef.current;
        if (!el) return true;
        return el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    }, []);

    const scrollToBottom = useCallback((instant = false) => {
        const el = messagesContainerRef.current;
        if (!el) return;
        el.scrollTo({ top: el.scrollHeight, behavior: instant ? 'instant' : 'smooth' });
        setUnreadCount(0);
        isAtBottomRef.current = true;
    }, []);

    const handleScroll = useCallback(() => {
        isAtBottomRef.current = isAtBottom();
        if (isAtBottomRef.current) setUnreadCount(0);
    }, [isAtBottom]);

    const loadMessages = useCallback(async () => {
        try {
            const data = await getGeneralMessages();
            setMessages(data);
        } catch {
            // silencioso en polling
        }
    }, []);

    useEffect(() => {
        if (!usuario) return;
        loadMessages();

        const token = localStorage.getItem('token');
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://tfg-daw-smx4.onrender.com/api';
        const eventSource = new EventSource(`${apiBaseUrl}/mensajes/general/stream?token=${token}`);

        eventSource.addEventListener('mensaje', (event) => {
            try {
                const nuevoMensaje = JSON.parse(event.data) as Mensaje;
                setMessages((prev) => {
                    if (prev.some((m) => m.id_mensaje === nuevoMensaje.id_mensaje)) {
                        return prev;
                    }
                    return [...prev, nuevoMensaje];
                });
            } catch (err) {
                console.error('Error al parsear mensaje recibido vía SSE:', err);
            }
        });

        eventSource.onerror = (err) => {
            console.error('Error en conexión SSE (EventSource):', err);
        };

        return () => {
            eventSource.close();
        };
    }, [usuario, loadMessages]);

    useEffect(() => {
        const newCount = messages.length - prevMessagesLengthRef.current;
        const isInitialLoad = prevMessagesLengthRef.current === 0;
        prevMessagesLengthRef.current = messages.length;

        if (isInitialLoad || isAtBottomRef.current) {
            scrollToBottom(isInitialLoad);
        } else if (newCount > 0) {
            setUnreadCount(prev => prev + newCount);
        }
    }, [messages, scrollToBottom]);

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        const texto = input.trim();
        if (!texto || sending) return;
        setSending(true);
        setError(null);
        try {
            const nuevo = await sendGeneralMessage(texto);
            setMessages(prev => [...prev, nuevo]);
            setInput('');
            isAtBottomRef.current = true;
        } catch {
            setError('No se pudo enviar el mensaje. Inténtalo de nuevo.');
        } finally {
            setSending(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(e as unknown as React.FormEvent);
        }
    }

    return (
        <section className="py-8 lg:py-16">
            <h2 className="text-primary-dark text-2xl md:text-3xl font-bold mb-6 text-center">
                Chat general
            </h2>

            <div
                className="max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-gray-200 flex flex-col"
                style={{ height: '520px' }}>

                {/* Header */}
                <div className="bg-primary-dark px-5 py-3 flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-green-400 inline-block"></span>
                    <span className="text-white font-semibold text-sm tracking-wide"># general</span>
                    <span className="ml-auto text-white/50 text-xs">
                        {messages.length} mensaje{messages.length !== 1 ? 's' : ''}
                    </span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-hidden relative flex flex-col">
                    <div
                        ref={messagesContainerRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto bg-gray-50 px-5 py-4 flex flex-col gap-1"
                    >
                        {!usuario ? (
                            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 opacity-30" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <p className="text-sm font-medium">Inicia sesión para ver y enviar mensajes</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
                                <p className="text-sm">¡Sé el primero en escribir!</p>
                            </div>
                        ) : (
                            messages.map((msg, index) => {
                                const isOwn = msg.id_usuario === usuario.id_usuario;
                                const showHeader =
                                    index === 0 || messages[index - 1].id_usuario !== msg.id_usuario;

                                return (
                                    <div key={msg.id_mensaje}
                                        className={`flex gap-3 ${showHeader ? 'mt-3' : 'mt-0.5'}`}>
                                        {showHeader ? (
                                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold mt-0.5
                                            ${isOwn ? 'bg-primary-dark' : 'bg-secondary'}`}>
                                                {msg.nombre_usuario.charAt(0).toUpperCase()}
                                            </div>
                                        ) : (
                                            <div className="w-8 flex-shrink-0" />
                                        )}

                                        <div className="flex-1 min-w-0">
                                            {showHeader && (
                                                <div className="flex items-baseline gap-2 mb-0.5">
                                                    <span
                                                        className={`text-sm font-semibold ${isOwn ? 'text-primary-dark' : 'text-gray-700'}`}>
                                                        {msg.nombre_usuario}
                                                    </span>
                                                    <span className="text-gray-400 text-[10px]">
                                                        {formatTime(msg.fecha_hora)}
                                                    </span>
                                                </div>
                                            )}
                                            <p className="text-gray-700 text-sm leading-relaxed break-words m-0">
                                                {msg.contenido}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div />
                    </div>

                    {unreadCount > 0 && (
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none">
                            <button
                                onClick={() => scrollToBottom(false)}
                                className="pointer-events-auto flex items-center gap-2 bg-primary-dark text-white text-xs font-semibold
                                       px-4 py-1.5 rounded-full shadow-lg hover:bg-primary-light transition-colors animate-bounce"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24"
                                    fill="currentColor">
                                    <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
                                </svg>
                                {unreadCount} mensaje{unreadCount !== 1 ? 's' : ''} nuevo{unreadCount !== 1 ? 's' : ''}
                            </button>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="bg-white border-t border-gray-200 px-4 py-3">
                    {usuario ? (
                        <form onSubmit={handleSend} className="flex gap-2 items-end">
                            <textarea
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Escribe un mensaje..."
                                rows={1}
                                disabled={sending}
                                className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-2.5 text-sm
                                           focus:outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark
                                           disabled:opacity-50 bg-gray-50"
                                style={{ maxHeight: '96px' }}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || sending}
                                className="bg-primary-dark text-white rounded-xl px-4 py-2.5 text-sm font-medium
                                           hover:bg-primary-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                                           flex-shrink-0"
                            >
                                {sending ? (
                                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24"
                                        fill="currentColor">
                                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                    </svg>
                                )}
                            </button>
                        </form>
                    ) : (
                        <p className="text-center text-sm text-gray-400 py-1">
                            <a href="/login" className="text-primary-dark font-medium hover:underline">Inicia
                                sesión</a> para participar en el chat
                        </p>
                    )}
                    {error && (
                        <p className="text-red-500 text-xs mt-1 text-center">{error}</p>
                    )}
                </div>
            </div>
        </section>
    );
}
