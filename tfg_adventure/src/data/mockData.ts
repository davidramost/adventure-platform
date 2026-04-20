export interface Ubicacion {
  id_ubicacion: number;
  nombre: string;
  latitud: number | null;
  longitud: number | null;
}

export interface Ruta {
  id_ruta: number;
  id_usuario: number;
  id_ubicacion: number;
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
  password: string;
  imagen: string | null;
  rol: 'admin' | 'usuario';
}

export const ubicaciones: Ubicacion[] = [
  { id_ubicacion: 1, nombre: 'Trassierra, Córdoba', latitud: 37.9351, longitud: -4.8942 },
  { id_ubicacion: 2, nombre: 'Sierra de Hornachuelos', latitud: 37.8412, longitud: -5.2301 },
  { id_ubicacion: 3, nombre: 'Almodóvar del Río', latitud: 37.8117, longitud: -5.0207 },
  { id_ubicacion: 4, nombre: 'Zuheros, Córdoba', latitud: 37.5412, longitud: -4.3157 },
  { id_ubicacion: 5, nombre: 'Cerro Muriano, Córdoba', latitud: 37.9701, longitud: -4.7821 },
];

export const rutas: Ruta[] = [
  {
    id_ruta: 1,
    id_usuario: 1,
    id_ubicacion: 1,
    titulo: 'EL DESPERTAR',
    nombre_ruta: 'Arroyo del Bejarano',
    descripcion: 'Una ruta preciosa que discurre junto al arroyo del Bejarano, en plena sierra de Córdoba. El camino nos lleva por un frondoso bosque de ribera con álamos, fresnos y adelfas. Durante el recorrido podremos disfrutar de pequeñas cascadas y pozas naturales.\n\nEl punto de partida se encuentra en la antigua estación del Cerro Muriano, desde donde comenzaremos a descender suavemente hasta el cauce del arroyo. La vegetación es exuberante, especialmente en primavera.\n\nRecomendaciones: Llevar calzado cómodo de senderismo y agua suficiente. En verano, las pozas invitan a darse un baño.',
    distancia_km: 6,
    duracion_estimada: '2h 30m',
    dificultad: 'Baja',
    desnivel_metros: 150,
    imagen_url: '/Img/mountain_list_5.jpg',
    nombre_ubicacion: 'Trassierra, Córdoba',
    media_puntuacion: 4.5,
  },
  {
    id_ruta: 2,
    id_usuario: 1,
    id_ubicacion: 2,
    titulo: 'LA MAÑANA',
    nombre_ruta: 'Ermita de los Ángeles',
    descripcion: 'Ruta circular que nos lleva hasta la Ermita de los Ángeles, un lugar con unas vistas espectaculares de la sierra. El sendero transcurre entre encinas y alcornoques, ofreciendo sombra durante gran parte del recorrido.\n\nA mitad de camino encontraremos un mirador natural desde el que se divisa todo el valle del Guadalquivir. La ermita, de origen medieval, es un lugar perfecto para hacer una parada y disfrutar del paisaje.\n\nRecomendaciones: Se recomienda llevar bastones de senderismo para los tramos más empinados.',
    distancia_km: 13,
    duracion_estimada: '4h 15m',
    dificultad: 'Media',
    desnivel_metros: 420,
    imagen_url: '/Img/mountain_list_2.jpg',
    nombre_ubicacion: 'Sierra de Hornachuelos',
    media_puntuacion: 4.2,
  },
  {
    id_ruta: 3,
    id_usuario: 1,
    id_ubicacion: 3,
    titulo: 'LA CIMA',
    nombre_ruta: 'Castillo de Almodóvar',
    descripcion: 'Ruta exigente que asciende hasta el castillo de Almodóvar del Río. El recorrido combina tramos de media montaña con zonas más técnicas en la parte final de ascenso al castillo.\n\nDesde la cima las vistas son impresionantes: se puede ver toda la campiña cordobesa y el río Guadalquivir serpenteando por el valle. El castillo medieval está perfectamente restaurado.\n\nRecomendaciones: Ruta solo recomendada para senderistas experimentados. Llevar equipo completo de montaña y abundante agua.',
    distancia_km: 27,
    duracion_estimada: '8h 00m',
    dificultad: 'Alta',
    desnivel_metros: 890,
    imagen_url: '/Img/mountain_list_3.jpg',
    nombre_ubicacion: 'Almodóvar del Río',
    media_puntuacion: 4.8,
  },
  {
    id_ruta: 4,
    id_usuario: 1,
    id_ubicacion: 4,
    titulo: 'EL CAÑÓN',
    nombre_ruta: 'Río Bailón',
    descripcion: 'Espectacular ruta por el cañón del río Bailón, en la Subbética cordobesa. Un recorrido de dificultad media que discurre entre paredes rocosas, cuevas y formaciones kársticas únicas.\n\nEl sendero nos lleva hasta la Cueva de los Murciélagos, declarada Monumento Natural, desde donde podremos contemplar el impresionante paisaje del cañón.\n\nRecomendaciones: Llevar linterna si se quiere explorar la cueva. Precaución con las rocas húmedas.',
    distancia_km: 10,
    duracion_estimada: '3h 30m',
    dificultad: 'Media',
    desnivel_metros: 350,
    imagen_url: '/Img/mountain_list_2.jpg',
    nombre_ubicacion: 'Zuheros, Córdoba',
    media_puntuacion: 4.6,
  },
  {
    id_ruta: 5,
    id_usuario: 1,
    id_ubicacion: 5,
    titulo: 'LA SENDA',
    nombre_ruta: 'Cerro Muriano',
    descripcion: 'Ruta suave y muy accesible por los alrededores de Cerro Muriano. Ideal para familias y senderistas principiantes. El camino transcurre por pinares y dehesas, con varias áreas de descanso.\n\nDurante el recorrido se pueden ver restos de la antigua minería romana que dio nombre a la zona. Un paseo relajante con mucha historia.\n\nRecomendaciones: Ruta perfecta para hacer con niños. Hay fuentes de agua potable en el recorrido.',
    distancia_km: 5,
    duracion_estimada: '1h 45m',
    dificultad: 'Baja',
    desnivel_metros: 80,
    imagen_url: '/Img/mountain_list_5.jpg',
    nombre_ubicacion: 'Cerro Muriano, Córdoba',
    media_puntuacion: 3.9,
  },
];

export const resenas: Resena[] = [
  { id_resena: 1, id_ruta: 1, id_usuario: 2, nombre_usuario: 'María García', comentario: 'Una ruta preciosa, perfecta para pasar una mañana tranquila en la naturaleza. Las pozas son espectaculares.', puntuacion: 5, fecha: '2025-03-15' },
  { id_resena: 2, id_ruta: 1, id_usuario: 3, nombre_usuario: 'Carlos López', comentario: 'Muy bonita pero en verano hay mucha gente. Recomiendo ir temprano.', puntuacion: 4, fecha: '2025-04-02' },
  { id_resena: 3, id_ruta: 2, id_usuario: 2, nombre_usuario: 'María García', comentario: 'Las vistas desde la ermita son increíbles. Algo dura la subida pero merece la pena.', puntuacion: 4, fecha: '2025-02-20' },
  { id_resena: 4, id_ruta: 3, id_usuario: 3, nombre_usuario: 'Carlos López', comentario: 'Ruta muy exigente pero la recompensa es brutal. El castillo es impresionante desde arriba.', puntuacion: 5, fecha: '2025-01-10' },
  { id_resena: 5, id_ruta: 3, id_usuario: 2, nombre_usuario: 'María García', comentario: 'Solo para gente en buena forma. Llevad mucha agua y protección solar.', puntuacion: 4, fecha: '2025-05-18' },
  { id_resena: 6, id_ruta: 4, id_usuario: 3, nombre_usuario: 'Carlos López', comentario: 'El cañón del Bailón es espectacular. Una de las mejores rutas de la zona.', puntuacion: 5, fecha: '2025-06-01' },
];

export const usuarios: Usuario[] = [
  { id_usuario: 1, nombre_usuario: 'admin', email: 'admin@aventura.com', password: 'admin', imagen: null, rol: 'admin' },
  { id_usuario: 2, nombre_usuario: 'María García', email: 'maria@email.com', password: 'Test1234!', imagen: null, rol: 'usuario' },
  { id_usuario: 3, nombre_usuario: 'Carlos López', email: 'carlos@email.com', password: 'Test1234!', imagen: null, rol: 'usuario' },
];

// Favorites: map of userId -> array of rutaIds
export const favoritosIniciales: Record<number, number[]> = {
  2: [1, 3],
  3: [2, 4],
};
