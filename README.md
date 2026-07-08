# Adventure 🥾

Aplicación web de rutas de senderismo con gestión de favoritos, comentarios y tienda de productos. Un proyecto fullstack moderno con arquitectura cliente-servidor.

---

## 🎯 Características principales

- **Catálogo de rutas:** Descubre senderismos con mapas interactivos, dificultad, distancia y descripciones.
- **Sistema de autenticación:** Login/registro con JWT. Perfiles de usuario.
- **Favoritos y valoraciones:** Marca rutas favoritas, deja comentarios, califica.
- **Tienda integrada:** Carrito de compra, pedidos, gestión de productos.
- **Mapas en tiempo real:** Visualización de rutas con Leaflet.
- **Responsive:** Diseño adaptable a todos los dispositivos.

---

## 🛠 Stack Tecnológico

### Frontend (`tfg_adventure/`)
- **React 19** + TypeScript
- **TailwindCSS** para estilos
- **React Router** para navegación
- **Axios** con interceptors JWT
- **Leaflet + React-Leaflet** para mapas
- **Vite** como bundler

### Backend (`tfg_backend/`)
- **Spring Boot 4.0.5** (Java 17)
- **Spring Security** + JWT
- **Spring Data JPA**
- **MySQL** (TiDB Cloud compatible)
- **Validación con Jakarta**
- **CORS habilitado**

---

## 🚀 Quick Start

### Backend
```bash
cd tfg_backend
./mvnw spring-boot:run
# API disponible en http://localhost:8080
```

### Frontend
```bash
cd tfg_adventure
npm install
npm run dev
# App disponible en http://localhost:5173
```

### Base de datos
- Ejecuta `rutas_app.sql` para crear esquema
- Carga datos de ejemplo con `datos_rutas.sql`

---

## 📁 Estructura del proyecto

```
TFG_DAW/
├── tfg_backend/           Spring Boot REST API
│   ├── controller/        Endpoints REST
│   ├── service/           Lógica de negocio
│   ├── entity/            Modelos JPA
│   └── security/          JWT + Spring Security
├── tfg_adventure/         React Frontend
│   ├── src/pages/         Páginas principales
│   ├── src/components/    Componentes reutilizables
│   ├── src/services/      Llamadas API
│   └── src/context/       Gestión de estado (Auth)
└── rutas_app.sql          Schema base de datos
```

---

## 🔐 Seguridad

- **JWT Stateless:** Token en headers `Authorization: Bearer {token}`
- **BCrypt:** Contraseñas hasheadas con fuerza 12
- **CORS:** Configurado para desarrollo y producción
- **Validación:** Todos los endpoints validan input con Jakarta

---


## 👨‍💻 Autor

David Ramos — Trabajo de Fin de Grado (DAW)

---

**Última actualización:** Mayo 2026
