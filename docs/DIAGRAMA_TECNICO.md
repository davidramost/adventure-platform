# 📐 DIAGRAMA TÉCNICO DE ARQUITECTURA

## Arquitectura General de 3 Capas

```
┌─────────────────────────────────────────────────────────────────────┐
│                       NAVEGADOR DEL USUARIO                         │
│                                                                       │
│  http://localhost:5173 o https://tu-dominio.com (Producción)       │
└──────────────────────┬──────────────────────────────────────────────┘
                       │
                       │ HTTP/REST + CORS
                       │ Port 5173 (Vite Dev Server)
                       │
┌──────────────────────▼──────────────────────────────────────────────┐
│                                                                       │
│          FRONT-END LAYER: React + TypeScript + Tailwind             │
│                    (tfg_adventure)                                   │
│                                                                       │
│  PORT: 5173 (dev) / HTTPS (production)                             │
│                                                                       │
│  ├── src/pages/                                                      │
│  │   ├── LoginPage.tsx           → /login                           │
│  │   ├── RegisterPage.tsx        → /register                        │
│  │   ├── HomePage.tsx            → /                                │
│  │   ├── CategoryPage.tsx        → /category/:id                    │
│  │   ├── InfoPage.tsx            → /ruta/:id                        │
│  │   ├── CreatePage.tsx          → /create (admin)                  │
│  │   ├── FavoritesPage.tsx       → /favorites                       │
│  │   └── GalleryPage.tsx         → /gallery                         │
│  │                                                                    │
│  ├── src/components/                                                │
│  │   ├── Header.tsx              → Navbar con auth                  │
│  │   ├── Footer.tsx                                                 │
│  │   ├── LogoutButton.tsx        → Botón logout                     │
│  │   └── ProtectedRoute.tsx      → Wrapper para rutas seguras      │
│  │                                                                    │
│  ├── src/context/                                                   │
│  │   └── AuthContext.tsx         → Estado global de autenticación  │
│  │       - usuario: Usuario | null                                 │
│  │       - isAuthenticated: boolean                                │
│  │       - login(email, password)                                  │
│  │       - register(email, password, nombre)                       │
│  │       - logout()                                                │
│  │                                                                    │
│  ├── src/services/               → Llamadas HTTP a API             │
│  │   ├── authService.ts                                            │
│  │   │   - login(email, password)                                  │
│  │   │   - register(email, password, nombre)                       │
│  │   │   - logout()                                                │
│  │   │   - getCurrentUser()                                        │
│  │   │   - isAuthenticated()                                       │
│  │   │                                                              │
│  │   ├── rutaService.ts                                            │
│  │   │   - getRutas(filters?, page?)                              │
│  │   │   - getRutaById(id)                                         │
│  │   │   - createRuta(ruta)                                        │
│  │   │   - updateRuta(id, ruta)                                    │
│  │   │   - deleteRuta(id)                                          │
│  │   │                                                              │
│  │   ├── favoritoService.ts                                        │
│  │   ├── mensajeService.ts                                         │
│  │   ├── productoService.ts                                        │
│  │   └── usuarioService.ts                                         │
│  │                                                                    │
│  └── src/api/                                                       │
│      └── client.ts               → Interceptor de Axios            │
│          - Agrega token a headers                                  │
│          - Maneja errores 401                                      │
│          - Base URL: http://localhost:8080/api                     │
│                                                                      │
│  LOCAL STORAGE:                                                      │
│  - token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9..."               │
│  - usuario: { id: 1, nombre: "David", email: "david@..." }        │
│                                                                      │
└──────────────────────┬──────────────────────────────────────────────┘
                       │
                       │ HTTP/REST (JSON)
                       │ Authorization: Bearer <token>
                       │ Content-Type: application/json
                       │ Port 8080
                       │
┌──────────────────────▼──────────────────────────────────────────────┐
│                                                                       │
│        BACK-END LAYER: Spring Boot 4.0.5 + JPA + Security          │
│                   (tfg_backend)                                      │
│                                                                       │
│  PORT: 8080                                                          │
│  BASE PATH: /api                                                    │
│                                                                       │
│  ├── src/controller/            → REST Endpoints                   │
│  │   ├── AuthController                                            │
│  │   │   POST   /auth/login          → Request: {email, password}│
│  │   │   POST   /auth/register       → Request: {email, password, nombre}
│  │   │   POST   /auth/logout         → Response: { message }     │
│  │   │   POST   /auth/refresh        → Renovar JWT              │
│  │   │   Response: { token, usuario }                           │
│  │   │                                                            │
│  │   ├── RutaController                                           │
│  │   │   GET    /rutas              → Listar todas (paginación) │
│  │   │   GET    /rutas/{id}         → Detalle ruta              │
│  │   │   POST   /rutas              → Crear (admin)             │
│  │   │   PUT    /rutas/{id}         → Actualizar                │
│  │   │   DELETE /rutas/{id}         → Eliminar                  │
│  │   │   GET    /rutas/{id}/download → Descargar GPX           │
│  │   │                                                            │
│  │   ├── FavoritoController                                       │
│  │   │   GET    /favoritos          → Mis favoritos             │
│  │   │   POST   /favoritos/{idRuta} → Agregar                   │
│  │   │   DELETE /favoritos/{idRuta} → Remover                   │
│  │   │                                                            │
│  │   ├── MensajeController                                        │
│  │   │   GET    /rutas/{idRuta}/mensajes                         │
│  │   │   POST   /rutas/{idRuta}/mensajes                         │
│  │   │   DELETE /mensajes/{id}                                   │
│  │   │                                                            │
│  │   ├── MeGustaController                                        │
│  │   ├── ProductoController                                       │
│  │   ├── PedidoController                                         │
│  │   └── UsuarioController                                        │
│  │                                                                   │
│  ├── src/service/               → Lógica de negocio              │
│  │   ├── UsuarioService                                           │
│  │   ├── RutaService                                              │
│  │   ├── AuthService                                              │
│  │   ├── FavoritoService                                          │
│  │   ├── MensajeService                                           │
│  │   └── ProductoService                                          │
│  │                                                                   │
│  ├── src/repository/            → JPA Repositories              │
│  │   ├── UsuarioRepository extends JpaRepository                  │
│  │   ├── RutaRepository                                           │
│  │   ├── FavoritoRepository                                       │
│  │   ├── MensajeRepository                                        │
│  │   └── ProductoRepository                                       │
│  │                                                                   │
│  ├── src/entity/                → JPA Entities (ORM)            │
│  │   ├── Usuario                                                  │
│  │   │   @Entity @Table(name="usuario")                          │
│  │   │   - id: Integer (PK)                                       │
│  │   │   - nombre: String                                         │
│  │   │   - email: String (UNIQUE)                                │
│  │   │   - password: String (BCrypt Hash)                        │
│  │   │   - fechaRegistro: LocalDateTime                          │
│  │   │   - favoritos: List<Favorito> (OneToMany)               │
│  │   │   - mensajes: List<Mensaje> (OneToMany)                  │
│  │   │                                                            │
│  │   ├── Ruta                                                     │
│  │   │   @Entity @Table(name="ruta")                             │
│  │   │   - id: Integer (PK)                                       │
│  │   │   - nombre: String                                        │
│  │   │   - descripcion: String                                   │
│  │   │   - dificultad: String                                    │
│  │   │   - distancia: Double                                     │
│  │   │   - duracion: String                                      │
│  │   │   - imagen: Blob/URL                                      │
│  │   │   - gpxFile: Blob                                         │
│  │   │   - favoritos: List<Favorito> (OneToMany)               │
│  │   │   - mensajes: List<Mensaje> (OneToMany)                  │
│  │   │                                                            │
│  │   ├── Favorito (Tabla de relación)                           │
│  │   │   - id_ruta: Integer (FK)                                │
│  │   │   - id_usuario: Integer (FK)                             │
│  │   │   @ManyToOne to Usuario                                   │
│  │   │   @ManyToOne to Ruta                                      │
│  │   │                                                            │
│  │   ├── Mensaje                                                  │
│  │   ├── MeGusta                                                  │
│  │   ├── Producto                                                 │
│  │   ├── Pedido                                                   │
│  │   └── LineaPedido                                              │
│  │                                                                   │
│  ├── src/dto/                   → Data Transfer Objects         │
│  │   ├── LoginRequest                                             │
│  │   ├── LoginResponse                                            │
│  │   ├── RegisterRequest                                          │
│  │   ├── UsuarioDto                                               │
│  │   ├── RutaDto                                                  │
│  │   └── ... DTOs para otros entities                            │
│  │                                                                   │
│  ├── src/security/              → Autenticación y autorización   │
│  │   ├── JwtTokenProvider                                         │
│  │   │   + generateToken(email): String                          │
│  │   │   + getEmailFromToken(token): String                      │
│  │   │   + validateToken(token): Boolean                         │
│  │   │                                                            │
│  │   ├── JwtAuthenticationFilter                                  │
│  │   │   - Intercepta requests                                   │
│  │   │   - Valida token en Authorization header                  │
│  │   │   - Autentica en SecurityContext                          │
│  │   │                                                            │
│  │   └── UserDetailsServiceImpl                                    │
│  │       - loadUserByUsername(email)                             │
│  │       - Retorna UserDetails para Spring Security             │
│  │                                                                │
│  ├── src/config/                → Configuración de Spring      │
│  │   ├── SecurityConfig                                          │
│  │   │   - Configura cadena de filtros de seguridad             │
│  │   │   - CSRF disabled para JSON API                           │
│  │   │   - Session Stateless (JWT)                              │
│  │   │   - AuthenticationManager                                 │
│  │   │   - PasswordEncoder (BCrypt)                              │
│  │   │                                                            │
│  │   ├── CorsConfig                                              │
│  │   │   - Permite origen frontend (localhost:5173)             │
│  │   │   - Permite métodos: GET, POST, PUT, DELETE              │
│  │   │   - Permite headers: Authorization, Content-Type         │
│  │   │   - Permite credentials                                  │
│  │   │                                                            │
│  │   └── JwtConfig                                               │
│  │       - Carga secret y expiration de properties              │
│  │                                                                │
│  ├── src/exception/             → Manejo de excepciones        │
│  │   ├── ResourceNotFoundException                               │
│  │   ├── UnauthorizedException                                   │
│  │   └── GlobalExceptionHandler                                  │
│  │       @ControllerAdvice response: { error, status, message }│
│  │                                                                │
│  └── application.properties     → Configuración                 │
│      - spring.datasource.url                                      │
│      - spring.datasource.username                                │
│      - spring.datasource.password                                │
│      - spring.jpa.hibernate.ddl-auto=validate                    │
│      - jwt.secret                                                │
│      - jwt.expiration                                            │
│      - logging.level.*                                           │
│                                                                    │
│  FLUJO DE AUTENTICACIÓN:                                          │
│  1. Cliente POST /auth/login {email, password}                   │
│  2. AuthController llama AuthService.authenticate()              │
│  3. AuthService busca Usuario por email                          │
│  4. Valida password con PasswordEncoder.matches()                │
│  5. JwtTokenProvider.generateToken(email)                        │
│  6. Retorna {token, usuario}                                     │
│  7. Cliente almacena token en localStorage                       │
│  8. Próximos requests incluyen header: Authorization: Bearer X   │
│  9. JwtAuthenticationFilter valida token                         │
│  10. Si válido, procede; si no, retorna 401                      │
│                                                                    │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ JDBC / Connector/J
                       │ Conexión TCP/IP
                       │ Port 3306 (usualmente)
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                                                                   │
│     DATA LAYER: MySQL Database (ProfesionalHosting)            │
│                                                                   │
│  hostname: tu-hosting.com                                        │
│  port: 3306                                                      │
│  database: rutas_app                                             │
│  charset: utf8mb4                                               │
│                                                                   │
│  TABLES:                                                         │
│  ├── usuario                                                     │
│  │   id_usuario (PK) INT AUTO_INCREMENT                         │
│  │   nombre VARCHAR(255)                                         │
│  │   email VARCHAR(255) UNIQUE                                   │
│  │   password VARCHAR(255) (BCrypt Hash)                         │
│  │   fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP          │
│  │   [admin BOOLEAN DEFAULT FALSE] (opcional)                   │
│  │                                                                │
│  ├── ruta                                                        │
│  │   id_ruta (PK) INT AUTO_INCREMENT                            │
│  │   nombre VARCHAR(255)                                         │
│  │   descripcion TEXT                                            │
│  │   dificultad VARCHAR(50)                                      │
│  │   distancia DECIMAL(8,2)                                      │
│  │   duracion VARCHAR(50)                                        │
│  │   imagen LONGBLOB o VARCHAR(URL)                             │
│  │   gpx_file LONGBLOB                                           │
│  │   fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP          │
│  │                                                                │
│  ├── favorito                                                    │
│  │   id_ruta (FK) → ruta.id_ruta                               │
│  │   id_usuario (FK) → usuario.id_usuario                       │
│  │   PRIMARY KEY (id_ruta, id_usuario)                          │
│  │   fecha_agregado DATETIME DEFAULT CURRENT_TIMESTAMP          │
│  │                                                                │
│  ├── mensaje                                                     │
│  │   id_mensaje (PK) INT AUTO_INCREMENT                         │
│  │   contenido TEXT                                              │
│  │   fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP              │
│  │   id_usuario (FK) → usuario.id_usuario                       │
│  │   id_ruta (FK) → ruta.id_ruta                               │
│  │   [puntuacion DECIMAL(2,1)] (opcional)                       │
│  │                                                                │
│  ├── me_gusta                                                    │
│  │   id_ruta (FK) → ruta.id_ruta                               │
│  │   id_usuario (FK) → usuario.id_usuario                       │
│  │   PRIMARY KEY (id_ruta, id_usuario)                          │
│  │   fecha_like DATETIME DEFAULT CURRENT_TIMESTAMP              │
│  │                                                                │
│  ├── producto                                                    │
│  │   id_producto (PK) INT AUTO_INCREMENT                        │
│  │   nombre VARCHAR(255)                                         │
│  │   descripcion TEXT                                            │
│  │   precio DECIMAL(10,2)                                        │
│  │   stock INT DEFAULT 0                                         │
│  │   categoria VARCHAR(100)                                      │
│  │   [imagen LONGBLOB] (opcional)                               │
│  │                                                                │
│  ├── pedido                                                      │
│  │   id_pedido (PK) INT AUTO_INCREMENT                          │
│  │   fecha DATETIME DEFAULT CURRENT_TIMESTAMP                    │
│  │   total DECIMAL(10,2)                                         │
│  │   id_usuario (FK) → usuario.id_usuario                       │
│  │   [estado VARCHAR(50)] (opcional: pending, completed, etc)   │
│  │                                                                │
│  └── linea_pedido                                               │
│      id_pedido (FK) → pedido.id_pedido                          │
│      id_producto (FK) → producto.id_producto                    │
│      cantidad INT DEFAULT 1                                      │
│      precio_unitario DECIMAL(10,2)                              │
│      PRIMARY KEY (id_pedido, id_producto)                        │
│                                                                   │
│  CONEXIÓN SEGURA:                                               │
│  - useSSL=true en JDBC URL                                       │
│  - user/pass proporcionados por hosting                         │
│  - Connection pooling (HikariCP)                                │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Datos - Ejemplo: Obtener Rutas

```
1. FRONTEND (React)
   Component.tsx:
   useEffect(() => {
     rutaService.getRutas()
       .then(data => setRutas(data))
       .catch(err => console.error(err))
   }, [])

2. HTTP REQUEST
   GET /api/rutas?page=1&limit=10
   Headers: {
     Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...,
     Content-Type: application/json
   }

3. BACKEND Filter Chain
   JwtAuthenticationFilter
     ↓ Valida token
   CorsFilter
     ↓ Verifica origen
   DispatcherServlet
     ↓ Enruta a RutaController

4. BACKEND Processing
   RutaController.getRutas(Pageable)
     ↓
   RutaService.getAllRutas(Pageable)
     ↓
   RutaRepository.findAll(Pageable)
     ↓ Mapea resultados a DTOs
   Response: {
     content: [
       { id: 1, nombre: "Ruta1", ... },
       { id: 2, nombre: "Ruta2", ... }
     ],
     totalElements: 50,
     totalPages: 5,
     currentPage: 1
   }

5. DATABASE QUERY
   SELECT * FROM ruta LIMIT 10 OFFSET 0;
   
6. DATABASE RESPONSE
   50 rows found, returning 10

7. BACKEND Response
   HTTP 200 OK
   Body: JSON with ruta list

8. FRONTEND Processing
   rutaService.getRutas()
     ↓ Axios interceptor valida status
   Response received
     ↓ Transforma a array<RutaDto>
   setRutas(data)
     ↓ Re-render component
   Mostrar lista en UI
```

---

## 🔒 Flujo de Seguridad - JWT

```
LOGIN:
1. Usuario envía credenciales
   POST /auth/login
   { email: "user@example.com", password: "123456" }

2. Backend valida en BD
   SELECT * FROM usuario WHERE email = 'user@example.com'
   
3. Backend compara password
   PasswordEncoder.matches(password_input, password_hash)
   → true/false

4. Si correcto, genera JWT
   JwtTokenProvider.generateToken(email)
   → token = header.payload.signature
   
   Payload contiene:
   {
     "sub": "user@example.com",      // subject (email)
     "iat": 1712500000,              // issued at
     "exp": 1712586400,              // expiration
     ... puede contener más claims
   }
   
   Firmado con: HMAC-SHA512(secret_key)

5. Retorna token al frontend
   {
     token: "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
     usuario: { id: 1, nombre: "David", email: "..." }
   }

6. Frontend almacena en localStorage
   localStorage.setItem('token', token)

AUTHENTICATED REQUEST:
1. Frontend incluye token en header
   Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...

2. Backend recibe request
   JwtAuthenticationFilter extrae token de header
   Authorization: Bearer <token>

3. Valida firma del token
   JwtTokenProvider.validateToken(token)
   → Verifica que firma coincida con secret_key
   → Verifica que no ha expirado

4. Si válido, extrae email
   JwtTokenProvider.getEmailFromToken(token)
   → "user@example.com"

5. Carga usuario desde BD
   Usuario usuario = usuarioRepository.findByEmail(email)

6. Configura SecurityContext
   UsernamePasswordAuthenticationToken token_auth = 
     new UsernamePasswordAuthenticationToken(usuario, null, authorities)
   SecurityContextHolder.setContext(context)

7. Procede con request normalmente
   Controller puede acceder: @AuthenticationPrincipal Usuario usuario

8. Si token inválido o expirado
   → HTTP 401 Unauthorized
   → Frontend elimina token y redirige a login

TOKEN EXPIRATION:
- Configurado en jwt.expiration (ms)
- Valor recomendado: 86400000 ms (24 horas)
- Al expirar: usuario debe re-autenticarse
- Opcionalmente: implement refresh token para renovación
```

---

## 🚀 Variables de Entorno (Ejemplo)

```bash
# application.properties - DESARROLLO
spring.datasource.url=jdbc:mysql://localhost:3306/rutas_app?serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=
jdbc.url=jdbc:mysql://localhost:3306/rutas_app
cors.allowed-origins=http://localhost:5173,http://localhost:3000
jwt.secret=dev-secret-key-not-for-production-change-this-now
jwt.expiration=86400000

# application-prod.properties - PRODUCCIÓN
spring.datasource.url=jdbc:mysql://tu-hosting.com:3306/rutas_app?serverTimezone=UTC&useSSL=true
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
cors.allowed-origins=https://tu-frontend.com
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

# .env.local - React DESARROLLO
VITE_API_URL=http://localhost:8080/api

# .env.production - React PRODUCCIÓN
VITE_API_URL=https://api.tu-dominio.com/api
```

---

## 📊 Tabla de Endpoints

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| POST | /auth/login | ❌ | Login de usuario |
| POST | /auth/register | ❌ | Registro de usuario |
| POST | /auth/logout | ✅ | Logout (limpia token) |
| GET | /rutas | ❌ | Listar todas las rutas |
| GET | /rutas/{id} | ❌ | Detalle de una ruta |
| POST | /rutas | ✅ Admin | Crear ruta |
| PUT | /rutas/{id} | ✅ Admin | Actualizar ruta |
| DELETE | /rutas/{id} | ✅ Admin | Eliminar ruta |
| GET | /rutas/{id}/download | ❌ | Descargar GPX |
| GET | /favoritos | ✅ | Mis favoritos |
| POST | /favoritos/{idRuta} | ✅ | Agregar a favoritos |
| DELETE | /favoritos/{idRuta} | ✅ | Remover de favoritos |
| GET | /rutas/{idRuta}/mensajes | ❌ | Comentarios de ruta |
| POST | /rutas/{idRuta}/mensajes | ✅ | Crear comentario |
| DELETE | /mensajes/{id} | ✅ | Eliminar comentario |
| GET | /productos | ❌ | Listar productos |
| GET | /productos/{id} | ❌ | Detalle producto |
| GET | /pedidos | ✅ | Mis pedidos |
| POST | /pedidos | ✅ | Crear pedido |

---

## ⚠️ Consideraciones de Seguridad

```javascript
// ✅ CORRECTO
Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...

// ❌ INCORRECTO
fetch("/api/rutas?token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...")
Cookie: token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...

// ✅ CORRECTO - Hash
password = bcrypt.hash("micontraseña123", 10)
// Output: $2b$10$R9h7cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ee34pfIKnqtYFHqK

// ❌ INCORRECTO - Plaintext
password = "micontraseña123"  // NUNCA HACER ESTO

// ✅ CORRECTO - Variables de entorno
const jwtSecret = process.env.JWT_SECRET

// ❌ INCORRECTO - Hardcoded
const jwtSecret = "mi-super-secreto-en-el-codigo"
```

---

**Fecha:** 7 de abril de 2026
**Versión:** 1.0
**Mantenido por:** Equipo TFG
