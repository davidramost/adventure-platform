export interface Ubicacion {
    id_ubicacion: number;
    nombre: string;
    latitud: number | null;
    longitud: number | null;
}

export interface Ruta {
    id_ruta: number;
    id_usuario: number;
    titulo: string;
    nombre_ruta: string;
    descripcion: string;
    distancia_km: number;
    duracion_estimada: string;
    dificultad: 'Baja' | 'Media' | 'Alta';
    desnivel_metros: number;
    imagen_url: string;
    nombre_ubicacion: string;
    media_puntuacion: number;
}

export interface Resena {
    id_resena: number;
    id_ruta: number;
    id_usuario: number;
    nombre_usuario: string;
    comentario: string;
    puntuacion: number;
    fecha: string;
}

export interface Usuario {
    id_usuario: number;
    nombre_usuario: string;
    email: string;
    rol: 'admin' | 'usuario';
    imagen?: string | null;
}

export interface AuthResponse {
    token: string;
    usuario: Usuario;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    nombre_usuario: string;
    email: string;
    password: string;
}

export interface RutaRequest {
    titulo: string;
    nombre_ruta: string;
    descripcion: string;
    distancia_km: number;
    duracion_estimada: string;
    dificultad: string;
    desnivel_metros: number;
    imagen_url: string;
    id_ubicacion?: number;
    nombre_ubicacion?: string;
    latitud?: number;
    longitud?: number;
}

export interface ResenaRequest {
    comentario: string;
    puntuacion: number;
}

export interface ErrorResponse {
    message: string;
    timestamp: string;
}

export interface UpdateUsuarioRequest {
    nombre_usuario?: string;
}

export interface UploadAvatarResponse {
    imagen: string;
}

export interface Mensaje {
    id_mensaje: number;
    contenido: string;
    fecha_hora: string;
    id_usuario: number;
    nombre_usuario: string;
    id_ruta: number | null;
}

export interface Producto {
    id_producto: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria: string;
    imagen: string;
}

export interface LineaPedidoResponse {
    id_producto: number;
    nombre_producto: string;
    imagen_producto: string;
    precio_unitario: number;
    cantidad: number;
    subtotal: number;
}

export interface PedidoResponse {
    id_pedido: number;
    fecha: string;
    total: number;
    lineas: LineaPedidoResponse[];
}

export interface CrearPedidoRequest {
    lineas: { id_producto: number; cantidad: number }[];
}
