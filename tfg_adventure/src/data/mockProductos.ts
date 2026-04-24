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
    imagen: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id_producto: 2,
    nombre: "Zapatillas de Trekking Impermeables",
    descripcion: "Calzado con agarre superior para terrenos difíciles y tecnología Gore-Tex.",
    precio: 89.99,
    stock: 15,
    categoria: "Calzado",
    imagen: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id_producto: 3,
    nombre: "Botella de Agua Térmica 1L",
    descripcion: "Mantiene el agua fría hasta por 24 horas y caliente por 12 horas.",
    precio: 15.50,
    stock: 50,
    categoria: "Accesorios",
    imagen: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id_producto: 4,
    nombre: "Chaqueta Cortavientos Ligera",
    descripcion: "Perfecta para climas cambiantes, compactable y con capucha ajustable.",
    precio: 55.00,
    stock: 20,
    categoria: "Ropa",
    imagen: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id_producto: 5,
    nombre: "Bastones de Senderismo Plegables",
    descripcion: "Bastones de fibra de carbono, ligeros y ajustables a cualquier altura.",
    precio: 35.00,
    stock: 30,
    categoria: "Equipo",
    imagen: "https://images.unsplash.com/photo-1517462964-21fdce3f25c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id_producto: 6,
    nombre: "Tienda de Campaña 2 Personas",
    descripcion: "Fácil de montar, resistente al agua y a los fuertes vientos de montaña.",
    precio: 120.00,
    stock: 10,
    categoria: "Equipo",
    imagen: "https://images.unsplash.com/photo-1504280390224-dd0b468a5d45?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];
