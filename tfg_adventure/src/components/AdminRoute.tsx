import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import NotFoundPage from '../pages/NotFoundPage';

interface AdminRouteProps {
    children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
    const { usuario, loading } = useAuth();

    if (usuario && usuario.rol !== 'admin') {
        return <NotFoundPage />;
    }

    if (loading) return null;

    if (!usuario) {
        return <NotFoundPage />;
    }

    return <>{children}</>;
}
