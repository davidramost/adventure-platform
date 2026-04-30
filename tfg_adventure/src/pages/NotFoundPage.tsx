import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function NotFoundPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-gradient-to-br from-primary-light to-primary-dark">
                <Header transparent />
            </header>

            <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary-light to-primary-dark">
                <div className="text-center text-white px-6">
                    <h1 className="text-8xl font-bold mb-4 opacity-60">404</h1>
                    <h2 className="text-2xl font-semibold mb-4">Página no encontrada</h2>
                    <p className="text-white/70 mb-8">La ruta que buscas no existe o ha sido eliminada.</p>
                    <Link
                        to="/"
                        className="inline-block bg-white text-primary-dark font-semibold px-8 py-3 rounded-full hover:bg-white/90 transition-colors"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
