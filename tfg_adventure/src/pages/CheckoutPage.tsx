import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Image from '../components/Image';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { pedidoService } from '../services/pedidoService';
import type { TipoEnvio, MetodoPago } from '../types';

const ENVIO_OPTIONS: { value: TipoEnvio; label: string; sublabel: string; precio: number }[] = [
    { value: 'ESTANDAR', label: 'Envío estándar', sublabel: '3-5 días hábiles', precio: 0 },
    { value: 'EXPRESS', label: 'Envío express', sublabel: '24 horas', precio: 4.99 },
    { value: 'RECOGIDA_PUNTO', label: 'Recogida en punto Correos', sublabel: '5-7 días hábiles', precio: 0 },
];

function formatCardNumber(value: string) {
    return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
}

export default function CheckoutPage() {
    const { usuario } = useAuth();
    const { cart, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();

    const profileOk =
        !!usuario?.nombre?.trim() &&
        !!usuario?.apellido?.trim() &&
        !!usuario?.domicilio?.trim();

    const [tipoEnvio, setTipoEnvio] = useState<TipoEnvio>('ESTANDAR');
    const [metodoPago, setMetodoPago] = useState<MetodoPago>('TARJETA');

    const [direccionOpt, setDireccionOpt] = useState<'domicilio' | 'facturacion' | 'otra'>('domicilio');
    const [otraDireccion, setOtraDireccion] = useState('');

    const [cardNumero, setCardNumero] = useState('');
    const [cardTitular, setCardTitular] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [bizumTelefono, setBizumTelefono] = useState('');
    const [paypalConectado, setPaypalConectado] = useState(false);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [pedidoCreado, setPedidoCreado] = useState(false);

    const gastoEnvio = ENVIO_OPTIONS.find(o => o.value === tipoEnvio)?.precio ?? 0;
    const totalFinal = totalPrice + gastoEnvio;

    const getDireccionEnvio = () => {
        if (direccionOpt === 'domicilio') return usuario?.domicilio ?? '';
        if (direccionOpt === 'facturacion') return usuario?.fact_domicilio ?? '';
        return otraDireccion.trim();
    };

    const isMetodoPagoValid = () => {
        if (metodoPago === 'TARJETA') {
            const digits = cardNumero.replace(/\s/g, '');
            const expiryMatch = cardExpiry.match(/^(\d{2})\/(\d{2})$/);
            let expiryValid = false;
            if (expiryMatch) {
                const mes = parseInt(expiryMatch[1], 10);
                const anio = parseInt(expiryMatch[2], 10) + 2000;
                const now = new Date();
                expiryValid = mes >= 1 && mes <= 12 && (anio > now.getFullYear() || (anio === now.getFullYear() && mes >= now.getMonth() + 1));
            }
            return digits.length === 16 && cardTitular.trim() && expiryValid && cardCvv.length === 3;
        }
        if (metodoPago === 'BIZUM') {
            const tel = bizumTelefono.replace(/\s/g, '');
            return /^(\+34)?[67]\d{8}$/.test(tel);
        }
        if (metodoPago === 'PAYPAL') {
            return paypalConectado;
        }
        return false;
    };

    const isFormIncomplete = () => {
        const direccion = getDireccionEnvio();
        const direccionValid = !!direccion;
        return !direccionValid || !isMetodoPagoValid();
    };

    const validate = () => {
        const e: Record<string, string> = {};

        const dir = getDireccionEnvio();
        if (!dir) e.direccion = 'La dirección de envío es obligatoria.';

        if (metodoPago === 'TARJETA') {
            const digits = cardNumero.replace(/\s/g, '');
            if (digits.length !== 16) e.cardNumero = 'El número de tarjeta debe tener 16 dígitos.';
            if (!cardTitular.trim()) e.cardTitular = 'El nombre del titular es obligatorio.';
            const expiryMatch = cardExpiry.match(/^(\d{2})\/(\d{2})$/);
            if (!expiryMatch) {
                e.cardExpiry = 'Fecha inválida. Formato MM/AA.';
            } else {
                const mes = parseInt(expiryMatch[1], 10);
                const anio = parseInt(expiryMatch[2], 10) + 2000;
                const now = new Date();
                if (mes < 1 || mes > 12) e.cardExpiry = 'Mes inválido.';
                else if (anio < now.getFullYear() || (anio === now.getFullYear() && mes < now.getMonth() + 1))
                    e.cardExpiry = 'La tarjeta ha caducado.';
            }
            if (cardCvv.length !== 3) e.cardCvv = 'El CVV debe tener 3 dígitos.';
        }

        if (metodoPago === 'BIZUM') {
            const tel = bizumTelefono.replace(/\s/g, '');
            if (!/^(\+34)?[67]\d{8}$/.test(tel)) e.bizumTelefono = 'Introduce un número de móvil español válido.';
        }

        if (metodoPago === 'PAYPAL' && !paypalConectado) {
            e.paypal = 'Debes conectar tu cuenta de PayPal antes de confirmar.';
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleConfirmar = async () => {
        if (!validate()) return;
        setLoading(true);
        try {
            await pedidoService.crear({
                lineas: cart.map(item => ({ id_producto: item.producto.id_producto, cantidad: item.cantidad })),
                direccion_envio: getDireccionEnvio(),
                tipo_envio: tipoEnvio,
                metodo_pago: metodoPago,
            });
            clearCart();
            setPedidoCreado(true);
        } catch {
            setErrors({ general: 'Ha ocurrido un error al procesar el pedido. Inténtalo de nuevo.' });
        } finally {
            setLoading(false);
        }
    };

    if (!usuario) {
        navigate('/login');
        return null;
    }

    if (cart.length === 0 && !pedidoCreado) {
        return (
            <div className="flex flex-col min-h-screen">
                <header className="bg-gradient-to-br from-primary-light to-primary-dark">
                    <Header transparent />
                </header>
                <main className="flex-1 bg-surface-dark flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-400 text-lg mb-6">Tu carrito está vacío.</p>
                        <Link to="/tienda" className="inline-block bg-primary-dark hover:bg-primary-light text-white font-bold py-3 px-8 rounded-full transition-colors no-underline">
                            Ir a la Tienda
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (pedidoCreado) {
        return (
            <div className="flex flex-col min-h-screen">
                <header className="bg-gradient-to-br from-primary-light to-primary-dark">
                    <Header transparent />
                </header>
                <main className="flex-1 bg-surface-dark flex items-center justify-center px-4">
                    <div className="bg-surface rounded-2xl border border-[#333] p-10 max-w-md w-full text-center shadow-xl">
                        <div className="w-16 h-16 rounded-full bg-green-400/20 flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h2 className="text-white text-2xl font-bold mb-3">¡Pedido confirmado!</h2>
                        <p className="text-gray-400 mb-8">Gracias por tu compra. Recibirás la confirmación en breve.</p>
                        <div className="flex flex-col gap-3">
                            <Link to="/tienda" className="w-full inline-block bg-primary-light hover:bg-primary-dark text-white font-bold py-3 rounded-xl transition-colors no-underline text-center">
                                Seguir comprando
                            </Link>
                            <Link to="/perfil" className="w-full inline-block bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-xl transition-colors no-underline text-center">
                                Ver mis pedidos
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-gradient-to-br from-primary-light to-primary-dark">
                <Header transparent />
            </header>

            <main className="flex-1 bg-surface-dark py-10 px-[5%]">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <Link to="/carrito" className="text-gray-400 hover:text-white transition-colors no-underline">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                        </Link>
                        <h1 className="text-white text-3xl font-bold">Finalizar compra</h1>
                    </div>

                    {!profileOk && (
                        <div className="bg-yellow-400/10 border border-yellow-400/40 rounded-xl p-4 mb-6 flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                            <p className="text-yellow-400 text-sm">
                                Tu perfil está incompleto. Para agilizar el proceso,{' '}
                                <Link to="/perfil" className="underline text-yellow-300 hover:text-yellow-200">completa tus datos</Link>{' '}
                                (nombre, apellido y domicilio).
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left column: address + shipping + payment */}
                        <div className="lg:w-3/5 flex flex-col gap-6">

                            {/* Section 1: Shipping address */}
                            <section className="bg-surface rounded-2xl border border-[#333] p-6 shadow-lg">
                                <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary-dark text-white text-xs flex items-center justify-center font-bold">1</span>
                                    Dirección de envío
                                </h2>

                                {usuario.nombre && (
                                    <div className="bg-[#1a1a1a] rounded-lg p-3 mb-5 text-gray-400 text-sm">
                                        <span className="text-white font-medium">{usuario.nombre} {usuario.apellido}</span>
                                    </div>
                                )}

                                <div className="flex flex-col gap-3">
                                    {usuario.domicilio && (
                                        <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${direccionOpt === 'domicilio' ? 'border-primary-dark bg-primary-dark/25 shadow-lg shadow-primary-dark/20' : 'border-[#444] hover:border-[#666] hover:shadow-md hover:shadow-white/5'}`}>
                                            <input type="radio" name="direccion" value="domicilio" checked={direccionOpt === 'domicilio'} onChange={() => setDireccionOpt('domicilio')} className="mt-1 accent-primary-dark w-5 h-5" />
                                            <div>
                                                <p className={`${direccionOpt === 'domicilio' ? 'text-white' : 'text-gray-300'} font-medium text-sm`}>Mi domicilio</p>
                                                <p className="text-gray-400 text-sm">{usuario.domicilio}</p>
                                            </div>
                                        </label>
                                    )}
                                    {usuario.fact_domicilio && (
                                        <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${direccionOpt === 'facturacion' ? 'border-primary-dark bg-primary-dark/25 shadow-lg shadow-primary-dark/20' : 'border-[#444] hover:border-[#666] hover:shadow-md hover:shadow-white/5'}`}>
                                            <input type="radio" name="direccion" value="facturacion" checked={direccionOpt === 'facturacion'} onChange={() => setDireccionOpt('facturacion')} className="mt-1 accent-primary-dark w-5 h-5" />
                                            <div>
                                                <p className={`${direccionOpt === 'facturacion' ? 'text-white' : 'text-gray-300'} font-medium text-sm`}>Dirección de facturación</p>
                                                <p className="text-gray-400 text-sm">{usuario.fact_domicilio}</p>
                                            </div>
                                        </label>
                                    )}
                                    <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${direccionOpt === 'otra' ? 'border-primary-dark bg-primary-dark/25 shadow-lg shadow-primary-dark/20' : 'border-[#444] hover:border-[#666] hover:shadow-md hover:shadow-white/5'}`}>
                                        <input type="radio" name="direccion" value="otra" checked={direccionOpt === 'otra'} onChange={() => setDireccionOpt('otra')} className="mt-1 accent-primary-dark w-5 h-5" />
                                        <div className="flex-1">
                                            <p className="text-white font-medium text-sm mb-2">Otra dirección</p>
                                            {direccionOpt === 'otra' && (
                                                <input
                                                    type="text"
                                                    placeholder="Calle, número, piso, ciudad, código postal"
                                                    value={otraDireccion}
                                                    onChange={e => setOtraDireccion(e.target.value)}
                                                    className="w-full bg-[#222] border border-[#444] rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:border-primary-dark"
                                                />
                                            )}
                                        </div>
                                    </label>
                                </div>
                                {errors.direccion && <p className="text-red-400 text-xs mt-2">{errors.direccion}</p>}
                            </section>

                            {/* Section 2: Shipping type */}
                            <section className="bg-surface rounded-2xl border border-[#333] p-6 shadow-lg">
                                <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary-dark text-white text-xs flex items-center justify-center font-bold">2</span>
                                    Tipo de envío
                                </h2>
                                <div className="flex flex-col gap-3">
                                    {ENVIO_OPTIONS.map(opt => (
                                        <label
                                            key={opt.value}
                                            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${tipoEnvio === opt.value ? 'border-primary-dark bg-primary-dark/25 shadow-lg shadow-primary-dark/20' : 'border-[#444] hover:border-[#666] hover:shadow-md hover:shadow-white/5'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input type="radio" name="tipoEnvio" value={opt.value} checked={tipoEnvio === opt.value} onChange={() => setTipoEnvio(opt.value)} className="accent-primary-dark w-5 h-5" />
                                                <div>
                                                    <p className="text-white font-medium text-sm">{opt.label}</p>
                                                    <p className="text-gray-400 text-xs">{opt.sublabel}</p>
                                                </div>
                                            </div>
                                            <span className={`text-sm font-bold ${opt.precio === 0 ? 'text-green-400' : tipoEnvio === opt.value ? 'text-white' : 'text-gray-300'}`}>
                                                {opt.precio === 0 ? 'Gratis' : `${opt.precio.toFixed(2)} €`}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            {/* Section 3: Payment */}
                            <section className="bg-surface rounded-2xl border border-[#333] p-6 shadow-lg">
                                <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary-dark text-white text-xs flex items-center justify-center font-bold">3</span>
                                    Método de pago
                                </h2>

                                <div className="flex gap-3 mb-5">
                                    {(['TARJETA', 'BIZUM', 'PAYPAL'] as MetodoPago[]).map(m => (
                                        <button
                                            key={m}
                                            onClick={() => setMetodoPago(m)}
                                            className={`flex-1 py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer ${metodoPago === m ? 'border-primary-dark bg-primary-dark/25 text-white shadow-lg shadow-primary-dark/20' : 'border-[#444] text-gray-400 hover:border-[#666] bg-transparent hover:shadow-md hover:shadow-white/5'}`}
                                        >
                                            {m === 'TARJETA' && 'Tarjeta'}
                                            {m === 'BIZUM' && 'Bizum'}
                                            {m === 'PAYPAL' && 'PayPal'}
                                        </button>
                                    ))}
                                </div>

                                {metodoPago === 'TARJETA' && (
                                    <div className="flex flex-col gap-4">
                                        <div>
                                            <label className="block text-gray-400 text-xs mb-1.5">Número de tarjeta</label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                placeholder="1234 5678 9012 3456"
                                                value={cardNumero}
                                                onChange={e => setCardNumero(formatCardNumber(e.target.value))}
                                                className="w-full bg-[#1a1a1a] border border-[#444] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary-dark tracking-widest"
                                                maxLength={19}
                                            />
                                            {errors.cardNumero && <p className="text-red-400 text-xs mt-1">{errors.cardNumero}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-gray-400 text-xs mb-1.5">Titular de la tarjeta</label>
                                            <input
                                                type="text"
                                                placeholder="Nombre y apellidos"
                                                value={cardTitular}
                                                onChange={e => setCardTitular(e.target.value.toUpperCase())}
                                                className="w-full bg-[#1a1a1a] border border-[#444] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary-dark uppercase"
                                            />
                                            {errors.cardTitular && <p className="text-red-400 text-xs mt-1">{errors.cardTitular}</p>}
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-gray-400 text-xs mb-1.5">Fecha de caducidad</label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    placeholder="MM/AA"
                                                    value={cardExpiry}
                                                    onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                                                    className="w-full bg-[#1a1a1a] border border-[#444] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary-dark"
                                                    maxLength={5}
                                                />
                                                {errors.cardExpiry && <p className="text-red-400 text-xs mt-1">{errors.cardExpiry}</p>}
                                            </div>
                                            <div className="w-28">
                                                <label className="block text-gray-400 text-xs mb-1.5">CVV</label>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    placeholder="123"
                                                    value={cardCvv}
                                                    onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                                    className="w-full bg-[#1a1a1a] border border-[#444] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary-dark"
                                                    maxLength={3}
                                                />
                                                {errors.cardCvv && <p className="text-red-400 text-xs mt-1">{errors.cardCvv}</p>}
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-xs flex items-center gap-1.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                            Pago simulado. No se realizará ningún cargo real.
                                        </p>
                                    </div>
                                )}

                                {metodoPago === 'BIZUM' && (
                                    <div>
                                        <label className="block text-gray-400 text-xs mb-1.5">Número de móvil</label>
                                        <div className="flex gap-3 items-center">
                                            <span className="text-gray-400 text-sm bg-[#1a1a1a] border border-[#444] rounded-lg px-3 py-3 shrink-0">+34</span>
                                            <input
                                                type="tel"
                                                inputMode="numeric"
                                                placeholder="6XX XXX XXX"
                                                value={bizumTelefono}
                                                onChange={e => setBizumTelefono(e.target.value.replace(/\D/g, '').slice(0, 9))}
                                                className="flex-1 bg-[#1a1a1a] border border-[#444] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary-dark"
                                                maxLength={9}
                                            />
                                        </div>
                                        {errors.bizumTelefono && <p className="text-red-400 text-xs mt-1">{errors.bizumTelefono}</p>}
                                        <p className="text-gray-400 text-xs mt-3 flex items-center gap-1.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                            Pago simulado. No se realizará ningún cargo real.
                                        </p>
                                    </div>
                                )}

                                {metodoPago === 'PAYPAL' && (
                                    <div className="text-center py-4">
                                        {paypalConectado ? (
                                            <div className="flex items-center justify-center gap-2 text-green-400 font-medium">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                Cuenta PayPal conectada correctamente
                                            </div>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => setPaypalConectado(true)}
                                                    className="bg-[#003087] hover:bg-[#002060] text-white font-bold py-3 px-8 rounded-full transition-colors cursor-pointer border-none text-sm"
                                                >
                                                    <span className="text-[#009cde]">Pay</span><span className="text-[#012169]">Pal</span>
                                                    <span className="ml-2 text-white">— Continuar con PayPal</span>
                                                </button>
                                                {errors.paypal && <p className="text-red-400 text-xs mt-2">{errors.paypal}</p>}
                                                <p className="text-gray-400 text-xs mt-3">Pago simulado. No se realizará ningún cargo real.</p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* Right column: order summary */}
                        <div className="lg:w-2/5">
                            <div className="bg-surface rounded-2xl border border-[#333] p-6 shadow-lg sticky top-6">
                                <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary-dark text-white text-xs flex items-center justify-center font-bold">4</span>
                                    Resumen del pedido
                                </h2>

                                <ul className="flex flex-col gap-4 mb-5 max-h-72 overflow-y-auto pr-1">
                                    {cart.map(item => (
                                        <li key={item.producto.id_producto} className="flex items-center gap-3">
                                            <Image src={item.producto.imagen} alt={item.producto.nombre} containerClassName="w-14 h-14 shrink-0 rounded-xl" className="w-14 h-14 object-cover" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-medium truncate">{item.producto.nombre}</p>
                                                <p className="text-gray-400 text-xs">Cant. {item.cantidad}</p>
                                            </div>
                                            <span className="text-gray-300 text-sm shrink-0">{(item.producto.precio * item.cantidad).toFixed(2)} €</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="border-t border-white/10 pt-4 flex flex-col gap-2 mb-5">
                                    <div className="flex justify-between text-gray-400 text-sm">
                                        <span>Subtotal</span>
                                        <span>{totalPrice.toFixed(2)} €</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Envío ({ENVIO_OPTIONS.find(o => o.value === tipoEnvio)?.label})</span>
                                        <span className={gastoEnvio === 0 ? 'text-green-400' : 'text-gray-300'}>
                                            {gastoEnvio === 0 ? 'Gratis' : `${gastoEnvio.toFixed(2)} €`}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center border-t border-white/10 pt-4 mb-6">
                                    <span className="text-white font-bold text-lg">Total</span>
                                    <span className="text-white font-bold text-2xl">{totalFinal.toFixed(2)} €</span>
                                </div>

                                {errors.general && (
                                    <div className="bg-red-400/10 border border-red-400/30 rounded-lg p-3 mb-4 text-red-400 text-sm">
                                        {errors.general}
                                    </div>
                                )}

                                <button
                                    onClick={handleConfirmar}
                                    disabled={loading || isFormIncomplete()}
                                    className="w-full bg-primary-dark hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg cursor-pointer border-none text-base"
                                >
                                    {loading ? 'Procesando...' : 'Confirmar pedido'}
                                </button>

                                <p className="text-gray-400 text-xs text-center mt-3 flex items-center justify-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                    Transacción segura y simulada
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
