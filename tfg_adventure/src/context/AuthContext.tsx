import type {ReactNode} from 'react';
import {createContext, useCallback, useContext, useEffect, useState} from 'react';
import type {Ruta, RutaRequest, Usuario} from '../types';
import * as authService from '../services/authService';
import * as rutaService from '../services/rutaService';
import * as favoritoService from '../services/favoritoService';
import {usuarioService} from '../services/usuarioService';

interface AuthContextType {
    usuario: Usuario | null;
    favoritos: number[];
    rutas: Ruta[];
    loading: boolean;
    login: (email: string, password: string) => Promise<string | null>;
    logout: () => void;
    register: (nombreUsuario: string, email: string, password: string, nombre?: string, apellido?: string, domicilio?: string, factDomicilio?: string, imagen?: string) => Promise<string | null>;
    toggleFavorito: (idRuta: number) => Promise<void>;
    esFavorito: (idRuta: number) => boolean;
    addRuta: (data: RutaRequest) => Promise<void>;
    updateRuta: (idRuta: number, data: RutaRequest) => Promise<void>;
    deleteRuta: (idRuta: number) => Promise<void>;
    refreshRutas: () => Promise<void>;
    refreshUsuario: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({children}: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(() => {
        const saved = localStorage.getItem('usuario');
        return saved ? JSON.parse(saved) : null;
    });
    const [favoritos, setFavoritos] = useState<number[]>([]);
    const [rutas, setRutas] = useState<Ruta[]>([]);
    const [loading, setLoading] = useState(true);

    const loadRutas = useCallback(async () => {
        try {
            const data = await rutaService.getAllRutas();
            setRutas(data);
        } catch {
            setRutas([]);
        }
    }, []);

    const loadFavoritos = useCallback(async () => {
        if (!localStorage.getItem('token')) return;
        try {
            const favRutas = await favoritoService.getFavoritos();
            setFavoritos(favRutas.map(r => r.id_ruta));
        } catch (error: any) {
            console.error('❌ Error cargando favoritos:', error.response?.status, error.message);
            setFavoritos([]);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            await loadRutas();
            if (usuario) await loadFavoritos();
            setLoading(false);
        };
        init();
    }, []);

    const login = async (email: string, password: string): Promise<string | null> => {
        try {
            const res = await authService.login({email, password});
            localStorage.setItem('token', res.token);
            localStorage.setItem('usuario', JSON.stringify(res.usuario));
            setUsuario(res.usuario);
            const favRutas = await favoritoService.getFavoritos();
            setFavoritos(favRutas.map(r => r.id_ruta));
            return null;
        } catch (err: any) {
            return err.response?.data?.message || 'Error al iniciar sesión.';
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setUsuario(null);
        setFavoritos([]);
    };

    const register = async (nombreUsuario: string, email: string, password: string, nombre?: string, apellido?: string, domicilio?: string, factDomicilio?: string, imagen?: string): Promise<string | null> => {
        try {
            const res = await authService.register({
                nombre_usuario: nombreUsuario,
                email,
                password,
                nombre,
                apellido,
                domicilio,
                fact_domicilio: factDomicilio,
                imagen,
            });
            localStorage.setItem('token', res.token);
            localStorage.setItem('usuario', JSON.stringify(res.usuario));
            setUsuario(res.usuario);
            setFavoritos([]);
            return null;
        } catch (err: any) {
            return err.response?.data?.message || 'Error al registrarse.';
        }
    };

    const toggleFavorito = async (idRuta: number) => {
        if (!usuario) return;
        try {
            await favoritoService.toggleFavorito(idRuta);
            setFavoritos(prev =>
                prev.includes(idRuta) ? prev.filter(id => id !== idRuta) : [...prev, idRuta]
            );
        } catch (error: any) {
            console.error('❌ Error al toggle favorito:', error.response?.status, error.message);
        }
    };

    const esFavorito = (idRuta: number): boolean => favoritos.includes(idRuta);

    const addRuta = async (data: RutaRequest) => {
        await rutaService.createRuta(data);
        await loadRutas();
    };

    const updateRuta = async (idRuta: number, data: RutaRequest) => {
        await rutaService.updateRuta(idRuta, data);
        await loadRutas();
    };

    const deleteRuta = async (idRuta: number) => {
        await rutaService.deleteRuta(idRuta);
        setRutas(prev => prev.filter(r => r.id_ruta !== idRuta));
    };

    const refreshUsuario = async () => {
        try {
            const updatedUsuario = await usuarioService.getMe();
            localStorage.setItem('usuario', JSON.stringify(updatedUsuario));
            setUsuario(updatedUsuario);
        } catch {
            // silently fail
        }
    };

    return (
        <AuthContext.Provider value={{
            usuario, favoritos, rutas, loading,
            login, logout, register,
            toggleFavorito, esFavorito,
            addRuta, updateRuta, deleteRuta,
            refreshRutas: loadRutas,
            refreshUsuario,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
}
