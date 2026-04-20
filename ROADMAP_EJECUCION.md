# 🗺️ ROADMAP - Plan de Ejecución Detallado

**Proyecto:** TFG Adventure - Integración Completa
**Fecha Inicio:** 7 de abril de 2026
**Duración Estimada:** 3-4 semanas

---

## 📅 FASE 1: Configuración Inicial (Semana 1)

### Objetivo

Tener el backend conectado a BD y un login básico funcionando

### Sprint 1.1: Setup Backend (Días 1-2)

```
RESPONSABLE: Pep (Spring Boot Expert)

[ ] 1. Actualizar pom.xml
    Duración: 30 min
    Tareas:
    - Agregar MySQL Connector 8.0.33
    - Agregar Spring Boot Web
    - Agregar JWT (jjwt-api, jjwt-impl, jjwt-jackson)
    - Agregar Spring Security
    - Agregar Validation
    - Agregar Lombok
    - Agregar DevTools
    Verificación: mvn clean install sin errores

[ ] 2. Crear application.properties actualizado
    Duración: 1 hora
    Tareas:
    - Configuración de BD remota
    - Configuración de CORS
    - Configuración de JWT
    - Configuración de logging
    Nota: Esperar datos reales de Sabrina para BD

[ ] 3. Crear estructura de paquetes
    Duración: 30 min
    Tareas:
    - config/
    - controller/
    - service/
    - repository/
    - entity/
    - dto/
    - security/
    - exception/
    
[ ] 4. Test: Compilar proyecto sin errores
    Duración: 15 min
    mvn clean compile
```

### Sprint 1.2: Entity Classes & BD (Días 2-3)

```
RESPONSABLES: Pep + Sabrina

[ ] 1. Verificar schema de BD en ProfesionalHosting
    Responsable: Sabrina
    Duración: 1 hora
    Tareas:
    - Conectar a PhpMyAdmin
    - Exportar DDL de cada tabla
    - Documentar campos exactos
    - Identificar tipos de datos
    - Documentar FKs y constraints
    Entrega: Documento con schema exacto

[ ] 2. Crear Entity classes (mapeo ORM)
    Responsable: Pep + Sabrina
    Duración: 3 horas
    
    Entities a crear:
    
    [ ] Usuario.java
        @Entity @Table(name="usuario")
        - java mapping
        - @OneToMany favoritos, mensajes, pedidos
        - Validations
        
    [ ] Ruta.java
        @Entity @Table(name="ruta")
        - Mapeo BLOB para GPX
        - @OneToMany para favoritos/mensajes
        
    [ ] Favorito.java
        @Entity @Table(name="favorito")
        - @ManyToOne a Usuario
        - @ManyToOne a Ruta
        - @IdClass para PK compuesta
        
    [ ] Mensaje.java
    [ ] MeGusta.java
    [ ] Producto.java
    [ ] Pedido.java
    [ ] LineaPedido.java
    
    Test: Compilar sin errores

[ ] 3. Crear Repository interfaces
    Responsable: Pep
    Duración: 1.5 horas
    
    [ ] UsuarioRepository
        - findByEmail(email)
        - existsByEmail(email)
        
    [ ] RutaRepository
        - findAll(Pageable)
        - con @Query para filtros
        
    [ ] FavoritoRepository
    [ ] MensajeRepository
    [ ] ProductoRepository
    [ ] PedidoRepository
    
    Test: Compilar, no ejecutar queries aún

[ ] 4. Test: Conexión a BD remota
    Responsable: Sabrina + Pep
    Duración: 1 hora
    Tareas:
    - mvn spring-boot:run
    - Ver logs de conexión Hibernate
    - Verificar connection pool activo
    - Test SELECT simple desde BD
    Criterio éxito: Log sin errores de conexión SQL
```

### Sprint 1.3: Autenticación JWT (Día 3-4)

```
RESPONSABLE: Pep

[ ] 1. Crear JwtTokenProvider.java
    Duración: 1 hora
    Tareas:
    - generateToken(email)
    - getEmailFromToken(token)
    - validateToken(token)
    - Test con token de ejemplo
    
    Test: Generar token y validar firma

[ ] 2. Crear JwtAuthenticationFilter.java
    Duración: 1.5 horas
    Tareas:
    - Extraer token de Authorization header
    - Validar token
    - Cargar usuario desde BD
    - Configurar SecurityContext
    
    Test: Simular request con token válido/inválido

[ ] 3. Crear SecurityConfig.java
    Duración: 1 hora
    Tareas:
    - Configurar cadena de filtros
    - Agregar JwtAuthenticationFilter
    - Configurar CORS
    - Deshabilitar CSRF (API stateless)
    - PasswordEncoder (BCrypt)
    
    Test: Compilar sin errores

[ ] 4. Crear UserDetailsServiceImpl.java
    Duración: 45 min
    Tareas:
    - Implementar loadUserByUsername(email)
    - Retornar UserDetails con authorities
    
    Test: Test unitario con usuario mock

[ ] 5. Crear DTOs de autenticación
    Duración: 30 min
    - LoginRequest
    - LoginResponse
    - RegisterRequest
    - UsuarioDto (sin password)
```

### Sprint 1.4: AuthController (Día 4)

```
RESPONSABLE: Pep

[ ] 1. Crear AuthService.java
    Duración: 1.5 horas
    Tareas:
    - authenticate(email, password)
    - register(email, password, nombre)
    - hashPassword con BCrypt
    - Generar JWT
    
    Test: Test unitario con mocks

[ ] 2. Crear AuthController.java
    Duración: 1 hora
    Endpoints:
    
    [ ] POST /auth/register
        - Request: { email, password, nombre }
        - Response: { token, usuario }
        - Status: 201 CREATED / 400 BAD_REQUEST
        
    [ ] POST /auth/login
        - Request: { email, password }
        - Response: { token, usuario }
        - Status: 200 OK / 401 UNAUTHORIZED
        
    [ ] POST /auth/logout
        - Status: 200 OK
        
    Test: Postman con requests

[ ] 3. Crear GlobalExceptionHandler.java
    Duración: 45 min
    Tareas:
    - @ControllerAdvice
    - Manejar excepciones comunes
    - Retornar error en formato JSON
    
    Test: Intentar login con usuario inexistente

[ ] 4. Crear CorsConfig.java
    Duración: 30 min
    - Permitir origen frontend (localhost:5173)
    - Permitir métodos (GET, POST, PUT, DELETE)
    - Permite headers (Authorization, Content-Type)
    
    Test: Request desde React (CORS)
```

### Sprint 1.5: Frontend - Servicios HTTP (Día 5)

```
RESPONSABLES: Ani/Jess

[ ] 1. Instalar dependencias
    Duración: 15 min
    npm install axios
    
[ ] 2. Crear src/api/client.ts
    Duración: 45 min
    Tareas:
    - Axios instance con baseURL
    - Interceptor request (agregar token)
    - Interceptor response (manejar 401)
    - Test: console.log para verificar
    
[ ] 3. Crear src/services/authService.ts
    Duración: 1 hora
    Funciones:
    - login(email, password)
    - register(email, password, nombre)
    - logout()
    - getCurrentUser()
    - isAuthenticated()
    - Test: Mock API responses
    
[ ] 4. Actualizar src/context/AuthContext.tsx
    Duración: 1.5 horas
    Tareas:
    - useCallback para login/register/logout
    - useEffect para cargar usuario de localStorage
    - Integrar con authService
    - Test: Verificar estado con React DevTools
    
[ ] 5. Crear src/.env.local
    Duración: 15 min
    VITE_API_URL=http://localhost:8080/api
```

### Sprint 1.6: Frontend - UI Login (Día 5)

```
RESPONSABLES: Ani/Jess

[ ] 1. Actualizar LoginPage.tsx
    Duración: 1.5 horas
    - Formulario controlado (email, password)
    - Llamar authContext.login()
    - Manejo de errores
    - Redirección a home si éxito
    - Usar Tailwind para estilos
    
    Test: Flujo login completo

[ ] 2. Actualizar RegisterPage.tsx
    Duración: 1.5 horas
    - Formulario (email, password, confirmPassword, nombre)
    - Validaciones básicas
    - Llamar authContext.register()
    - Redirección a home si éxito
    
    Test: Flujo registro completo

[ ] 3. Crear Header.tsx mejorado
    Duración: 1 hora
    - Mostrar nombre de usuario si autenticado
    - Botón logout
    - Navegación condicional
    - Responsive design Tailwind
    
    Test: Ver header en diferentes estados

[ ] 4. Test E2E: Login Completo
    Duración: 1 hora
    Escenario:
    1. Registro usuario nuevo
    2. Logout
    3. Login con mismo usuario
    4. Verificar token en localStorage
    5. Verificar usuario en AuthContext
    Criterio éxito: Todo funciona sin errores
```

### ✅ Criterios de Aceptación - Fase 1

- [ ] Backend compila sin errores: `mvn clean compile`
- [ ] Conecta a BD remota (no hay errores de conexión en logs)
- [ ] JWT genera tokens válidos
- [ ] POST /auth/register funciona (Postman)
- [ ] POST /auth/login funciona (Postman)
- [ ] Tokens se incluyen en Authorization header
- [ ] CORS permitido desde <http://localhost:5173>
- [ ] React envía requests correctamente
- [ ] Login/Register funciona E2E desde React
- [ ] AuthContext persiste usuario en localStorage
- [ ] Logout limpia token y usuario

---

## 🔐 FASE 2: Endpoints de Rutas (Semana 2)

### Objetivo

CRUD completo de rutas con filtros y descarga de GPX

### Sprint 2.1: Rutas CRUD Backend

```
RESPONSABLE: Pep

[ ] 1. Crear RutaService.java
    Duración: 2 horas
    Métodos:
    - getAllRutas(Pageable, filters)
    - getRutaById(id)
    - createRuta(dto)
    - updateRuta(id, dto)
    - deleteRuta(id)
    - downloadGpx(id)
    - searchRutas(keyword)
    
[ ] 2. Crear RutaController.java
    Duración: 2 horas
    Endpoints:
    - GET /rutas (paginado, filtros: dificultad, distancia)
    - GET /rutas/{id}
    - POST /rutas (solo admin)
    - PUT /rutas/{id} (solo admin)
    - DELETE /rutas/{id} (solo admin)
    - GET /rutas/{id}/download (GPX)
    
[ ] 3. Crear RutaDto.java
    Duración: 30 min
    
[ ] 4. Tests: Crear datos de prueba en BD
    Duración: 1 hora
    - INSERT 5-10 rutas reales en tabla
    - Verificar desde PhpMyAdmin
    - Test endpoints con Postman
```

### Sprint 2.2: Rutas Frontend

```
RESPONSABLES: Ani/Jess

[ ] 1. Crear rutaService.ts
    Duración: 1.5 horas
    - getRutas(page, limit, filters)
    - getRutaById(id)
    - downloadGpx(id)
    
[ ] 2. Actualizar HomePage.tsx
    Duracion: 2 horas
    - Mostrar lista de rutas
    - Paginación
    - Filtros (por dificultad, distancia)
    - Cards con Tailwind
    
[ ] 3. Actualizar InfoPage.tsx
    Duracion: 2 horas
    - Cargar ruta por ID
    - Mostrar mapa (si utilizas librería)
    - Botón descargar GPX
    - Sección de comentarios (placeholder)
    
[ ] 4. Test: Navegar y cargar rutas
```

---

## ❤️ FASE 3: Favoritos y Comentarios (Semana 2-3)

### Sprint 3.1: Favoritos Backend

```
RESPONSABLE: Pep

[ ] 1. Crear FavoritoService.java
[ ] 2. Crear FavoritoController.java
[ ] 3. Endpoints:
    - GET /favoritos (actual usuario)
    - POST /favoritos/{idRuta} (agregar)
    - DELETE /favoritos/{idRuta} (remover)
    - GET /favoritos/check/{idRuta} (¿es favorito?)
```

### Sprint 3.2: Comentarios Backend

```
RESPONSABLE: Pep

[ ] 1. Crear MensajeService.java
[ ] 2. Crear MensajeController.java
[ ] 3. Endpoints:
    - GET /rutas/{idRuta}/mensajes
    - POST /rutas/{idRuta}/mensajes
    - DELETE /mensajes/{id}
    - PUT /mensajes/{id} (editar propio)
```

### Sprint 3.3: Frontend Favoritos & Comentarios

```
RESPONSABLES: Ani/Jess

[ ] 1. Crear favoritoService.ts
[ ] 2. Crear mensajeService.ts
[ ] 3. Actualizar InfoPage.tsx
    - Botón agregar/remover favorito
    - Sección comentarios
    - Formulario crear comentario
[ ] 4. Actualizar FavoritesPage.tsx
    - Listar favoritos del usuario
    - Eliminar desde página
```

---

## 🛒 FASE 4: Productos & Pedidos (Semana 3)

### Sprint 4.1: Productos Backend

```
RESPONSABLE: Pep

Endpoints:
- GET /productos (paginado, filtro por categoría)
- GET /productos/{id}
- POST /productos (admin)
- PUT /productos/{id} (admin)
- DELETE /productos/{id} (admin)
```

### Sprint 4.2: Pedidos Backend

```
RESPONSABLE: Pep

Endpoints:
- POST /pedidos (crear pedido)
- GET /pedidos (mis pedidos)
- GET /pedidos/{id} (detalle)
- PUT /pedidos/{id}/status (admin)
```

### Sprint 4.3: Frontend Tienda

```
RESPONSABLES: Ani/Jess

- GalleryPage.tsx (productos)
- Carrito (state o context)
- Checkout
- CreatePage.tsx integrado
```

---

## 🐳 FASE 5: Deployment (Semana 4)

### Sprint 5.1: Backend Deployment

```
[ ] 1. Crear JAR: mvn clean package
[ ] 2. Test: java -jar target/tfg_backend-0.0.1-SNAPSHOT.jar
[ ] 3. Subir a hosting (opción Java)
[ ] 4. Configurar variables de entorno en servidor
[ ] 5. Test endpoints en producción
```

### Sprint 5.2: Frontend Deployment

```
[ ] 1. Build: npm run build
[ ] 2. Deploy a Vercel / Netlify / Hosting
[ ] 3. Configurar VITE_API_URL a producción
[ ] 4. Test desde navegador real
```

### Sprint 5.3: Testing Final

```
[ ] 1. Test completo de usuario nuevo hasta compra
[ ] 2. Verificar errores 404, 401, 500
[ ] 3. Performance testing
[ ] 4. Security check (CORS, tokens, SQL injection)
```

---

## 📊 Matriz de Dependencias

```
          Semana 1      Semana 2      Semana 3      Semana 4
          ┌────────────┬────────────┬────────────┬────────────┐
Backend   │ Auth  ────→│ Rutas ────→│ Favoritos │ Test/Deploy│
          │            │            │ Comentarios│            │
          │            │            │            │            │
Frontend  │ API Setup  │ Rutas UI ──│ Fav/Comment│ Deploy     │
          │ Auth UI ──→│            │ UI    ────→│            │
          └────────────┴────────────┴────────────┴────────────┘

BLOQUEOS:
✗ No se puede hacer Frontend Auth sin Backend Auth
✗ No se puede hacer Rutas UI sin getRutas endpoint
✗ No se puede hacer Favoritos sin autenticación funcionando
```

---

## 🎯 Métricas de Progreso

Usar esta matriz para reportar estado:

| Tarea | Sprint | Estado | % | Bloqueadores | Próximo |
|-------|--------|--------|---|--------------|---------|
| pom.xml | 1.1 | 🔴 Not Started | 0% | Ninguno | Empezar |
| application.properties | 1.1 | 🟡 In Progress | 50% | Datos BD | Sabrina |
| Entities | 1.2 | 🟡 In Progress | 75% | Schema final | Testing |
| JWT | 1.3 | 🟡 In Progress | 80% | ExceptionHandler | Testing |
| AuthController | 1.4 | 🟡 In Progress | 90% | Global handler | Postman test |
| authService.ts | 1.5 | 🔴 Not Started | 0% | authController OK | Empezar |
| LoginPage | 1.6 | 🔴 Not Started | 0% | authService OK | Empezar |

Leyenda: 🔴 Not Started | 🟡 In Progress | 🟢 Done | 🔵 Blocked

---

## 📝 Daily Standup Template

```
DIARIO A LAS 09:00 - Duración: 15 min

Pep (Backend):
- Qué hice ayer → {Crear JwtTokenProvider}
- Qué hago hoy → {Crear JwtAuthenticationFilter}
- Bloqueadores → {Ninguno}

Sabrina (BD):
- Qué hice ayer → {Verificar schema}
- Qué hago hoy → {Confirmar credenciales de BD}
- Bloqueadores → {Esperando credenciales del hosting}

Ani/Jess (Frontend):
- Qué hice ayer → {Instalar axios}
- Qué hago hoy → {Crear API client}
- Bloqueadores → {Esperando que finalice AuthController en backend}
```

---

## 🚨 Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|-----------|
| Problemas conexión BD remota | Alta | Crítico | Sabrina verifica 1ª cosa |
| JWT muy complejo de entender | Media | Medio | Documentar bien, videos |
| Frontend y Backend desincronizados | Alta | Medio | Contract planning, Postman mocks |
| Base de datos sin índices | Baja | Bajo | Sabrina optimiza después |
| Configuración CORS incorrecta | Media | Cierre | Revisar logs del browser |
| Tokens expirando en desarrollo | Baja | Bajo | Aumentar expiración en dev |

---

## ✅ Documentación Requerida

```
Por completar en paralelo con código:

[ ] README.md actualizado
    - Cómo instalar backend
    - Cómo instalar frontend
    - Cómo conectar BD remota
    - Variables de entorno
    - Estructura del proyecto

[ ] API Documentation (Postman collection)
    - Todos los endpoints
    - Ejemplos de request/response
    - Códigos de error

[ ] Architecture Documentation
    - Diagramas (ERD, flujos)
    - Decisiones de diseño
    - Trade-offs

[ ] Setup Guide
    - Paso a paso para nuevo desarrollador
    - Passwords/secrets management
    - Deployment checklist
```

---

**Versión:** 1.0
**Última actualización:** 7 de abril de 2026
**Próxima revisión:** Al final de cada semana
