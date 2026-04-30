export interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen: string;
}

export const mockProductos: Producto[] = [
  {
    id_producto: 1,
    nombre: "Mochila de Senderismo 40L",
    descripcion: "Mochila resistente al agua ideal para rutas largas con soporte ergonómico.",
    precio: 49.99,
    stock: 25,
    categoria: "Mochilas",
    imagen: "https://picsum.photos/seed/mochila40l/800/600"
  },
  {
    id_producto: 2,
    nombre: "Zapatillas de Trekking Impermeables",
    descripcion: "Calzado con agarre superior para terrenos difíciles y tecnología Gore-Tex.",
    precio: 89.99,
    stock: 15,
    categoria: "Calzado",
    imagen: "https://picsum.photos/seed/zapatillastrek/800/600"
  },
  {
    id_producto: 3,
    nombre: "Botella de Agua Térmica 1L",
    descripcion: "Mantiene el agua fría hasta por 24 horas y caliente por 12 horas.",
    precio: 15.50,
    stock: 50,
    categoria: "Accesorios",
    imagen: "https://picsum.photos/seed/botellatermica/800/600"
  },
  {
    id_producto: 4,
    nombre: "Chaqueta Cortavientos Ligera",
    descripcion: "Perfecta para climas cambiantes, compactable y con capucha ajustable.",
    precio: 55.00,
    stock: 20,
    categoria: "Ropa",
    imagen: "https://picsum.photos/seed/chaquetaviento/800/600"
  },
  {
    id_producto: 5,
    nombre: "Bastones de Senderismo Plegables",
    descripcion: "Bastones de fibra de carbono, ligeros y ajustables a cualquier altura.",
    precio: 35.00,
    stock: 30,
    categoria: "Equipo",
    imagen: "https://picsum.photos/seed/bastonessend/800/600"
  },
  {
    id_producto: 6,
    nombre: "Tienda de Campaña 2 Personas",
    descripcion: "Fácil de montar, resistente al agua y a los fuertes vientos de montaña.",
    precio: 120.00,
    stock: 10,
    categoria: "Equipo",
    imagen: "https://picsum.photos/seed/tiendacampana/800/600"
  }
];
