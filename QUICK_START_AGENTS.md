# ⚡ QUICK START PER AGENT

Para usar este documento: Copia tu sección específica y comienza inmediatamente.

---

## 🔴 AGENTE: PEP (Spring Boot Expert)

### Tu Misión

Implementar el backend Spring Boot desde cero con autenticación JWT y CRUD de rutas.

### Comienza Aquí (30 minutos)

```
1. Abre /Users/david/workspace/TFG_DAW/tfg_backend/pom.xml
2. Reemplaza las dependencias con lo de ARQUITECTURA_INTEGRACION.md - Fase 1.1
3. Ejecuta: mvn clean install
4. Verifica que compila sin errores

Resultado esperado: BUILD SUCCESS
```

### Tu Tareas Inmediatas (en orden)

**SEMANA 1 - Días 1-2: (8 horas)**

```
[ ] Tarea 1: Actualizar pom.xml
    Referencia: ARQUITECTURA_INTEGRACION.md → Fase 1.1
    Tiempo: 30 min
    Validación: mvn clean compile

[ ] Tarea 2: Crear application.properties
    Referencia: ARQUITECTURA_INTEGRACION.md → Fase 1.2
    Tiempo: 1 hora
    Nota: Esperar datos de BD de Sabrina
    Validación: Archivo sin errores de sintaxis
    
    Coordinar con Sabrina para:
    - spring.datasource.url = ?
    - spring.datasource.username = ?
    - spring.datasource.password = ?

[ ] Tarea 3: Crear carpetas de paquetes
    Estructura:
    src/main/java/com/example/tfg_backend/
    ├── config/
    ├── controller/
    ├── service/
    ├── repository/
    ├── entity/
    ├── dto/
    ├── security/
    └── exception/
    
    Tiempo: 15 min

[ ] Tarea 4: Crear Entity classes
    Referencia: DIAGRAMA_TECNICO.md → Data Layer
    Tiempo: 3 horas
    
    Prioridad ALTA = Usuario, Ruta, Favorito
    Prioridad MEDIA = Mensaje, Producto
    Prioridad BAJA = Pedido, LineaPedido
    
    Validar con Sabrina schema exacto de BD
    
    Validación: Compilar sin errores

[ ] Tarea 5: Crear Repository interfaces
    Referencia: GUIA_AGENTS.md → RutaController
    Tiempo: 1.5 horas
    Implementar: JpaRepository con métodos custom
    
    Validación: Compilar sin errores
```

**SEMANA 1 - Días 3-4: (8 horas)**

```
[ ] Tarea 6: Crear Security Layer (JWT)
    Referencia: ARQUITECTURA_INTEGRACION.md → Fase 4
    Tiempo: 4 horas
    
    Archivos a crear:
    - src/main/java/com/example/tfg_backend/security/JwtTokenProvider.java
    - src/main/java/com/example/tfg_backend/security/JwtAuthenticationFilter.java
    - src/main/java/com/example/tfg_backend/security/UserDetailsServiceImpl.java
    - src/main/java/com/example/tfg_backend/config/SecurityConfig.java
    - src/main/java/com/example/tfg_backend/config/CorsConfig.java
    
    Código de referencia: ARQUITECTURA_INTEGRACION.md → Fase 4.1 y 4.2
    
    Validación: Compilar sin errores

[ ] Tarea 7: Crear DTOs de autenticación
    Tiempo: 30 min
    - LoginRequest.java
    - LoginResponse.java
    - RegisterRequest.java
    - UsuarioDto.java (sin password)
    
    Validación: Compilar

[ ] Tarea 8: Crear AuthService y AuthController
    Referencia: GUIA_AGENTS.md → AuthController
    Tiempo: 2.5 horas
    
    AuthService.java:
    - authenticate(email, password) → genera JWT
    - register(email, password, nombre) → crea usuario
    
    AuthController.java:
    - POST /auth/login
    - POST /auth/register
    - POST /auth/logout
    
    Validación: Compilar, después Postman testing

[ ] Tarea 9: Crear GlobalExceptionHandler
    Tiempo: 1 hora
    - @ControllerAdvice
    - Manejar ResourceNotFoundException
    - Manejar UnauthorizedException
    - Manejar validation errors
    
    Validación: Error responses en JSON format
```

**SEMANA 1 - Día 5: (4 horas)**

```
[ ] Tarea 10: Testing con Postman
    Tiempo: 2 horas
    
    Criterios de éxito:
    1. Backend compila: mvn clean compile → BUILD SUCCESS
    2. Backend inicia: mvn spring-boot:run sin errores
    3. POST /auth/register funciona
       Request: { email: "test@test.com", password: "test123", nombre: "Test" }
       Response: { token: "...", usuario: { id: 1, nombre: "Test", email: "..." } }
    4. POST /auth/login funciona con el usuario creado
    5. GET /api/rutas retorna lista de rutas (endpoint básico)
    6. Status 200 OK en todas las llamadas exitosas
    7. Status 401 cuando se envía token inválido

[ ] Tarea 11: Test integración con BD
    Tiempo: 2 horas
    
    Verificar:
    1. mvn spring-boot:run inicia sin errores de conexión
    2. Logs muestran: "Hibernate: Checking connection..."
    3. POST /auth/register está guardando en BD
    4. Verificar en PhpMyAdmin que usuario aparece en tabla usuario
    5. Token JWT es válido (verificar en https://jwt.io)
```

**Próximos sprints: SEMANA 2**

```
[ ] Crear RutaController (CRUD)
[ ] Crear FavoritoController
[ ] Crear MensajeController
[ ] Tests unitarios con JUnit 5
```

### 🛠 Herramientas

```
IDE: VS Code con Spring Boot Extension Pack
Testing: Postman o Thunder Client
JDK: 17 (ya instalado)
Maven: (ya configurado)
DB Client: PhpMyAdmin (admin - ver con Sabrina)
```

### 📞 Contacto con Otros Agents

```
❌ Bloquea a Ani/Jess si:
   - AuthController aún no funciona
   - JWT no está validando tokens

✅ Desbloquea a Ani/Jess cuando:
   - POST /auth/login funciona en Postman
   - POST /auth/register funciona en Postman

Coordina con Sabrina para:
   - Credenciales exactas de BD
   - Schema de tablas
   - Problemas de conexión JDBC
```

### Documentación Clave

```
Lee estos archivos (en orden):
1. ARQUITECTURA_INTEGRACION.md
2. DIAGRAMA_TECNICO.md
3. GUIA_AGENTS.md (tu sección)
4. aplicar.properties (cuando Sabrina lo proporcione)
```

---

## 🔵 AGENTE: SABRINA (Database Expert)

### Tu Misión

Garantizar que la conexión a la BD remota funcione perfectamente y optimizar queries.

### Tu Tareas Inmediatas (en orden)

**SEMANA 1 - Día 1: (4 horas)**

```
[ ] Tarea 1: Conectar a BD remota del hosting
    Datos que necesitas del usuario:
    - URL/hostname del hosting
    - Puerto MySQL (usualmente 3306)
    - Nombre de BD
    - Usuario de BD
    - Password de BD
    
    Verificar:
    1. Intentar conexión desde PhpMyAdmin hosting
    2. Listar todas las tablas
    3. Verificar estructura de cada tabla
    4. Exportar DDL de la BD
    
    Tiempo: 2 horas
    Resultado: Documento con "BD_SCHEMA.sql" (script dumpeo)

[ ] Tarea 2: Documentar schema exacto
    Tiempo: 1.5 horas
    Para cada tabla crear documento:
    
    Tabla: usuario
    - Columnas: id_usuario (INT, PK), nombre (VARCHAR), email (VARCHAR), password (VARCHAR), fecha_registro (DATETIME)
    - Constraints: UNIQUE(email)
    - Relaciones: FK con favorito, mensaje, pedido
    - Índices: (proponer si faltan)
    
    Igual para: ruta, favorito, mensaje, producto, pedido, linea_pedido
    
    Resultado: Documento "SCHEMA_DETALLADO.md"

[ ] Tarea 3: Proporcionar credenciales a Pep
    Tiempo: 30 min
    
    Generar content para application.properties:
    
    spring.datasource.url=jdbc:mysql://[HOST]:[PUERTO]/[BD_NAME]?serverTimezone=UTC&useSSL=true
    spring.datasource.username=[USER]
    spring.datasource.password=[PASSWORD]
    
    NO poner en repositorio - usar variables de entorno en producción
```

**SEMANA 1 - Día 2-3: (4 horas)**

```
[ ] Tarea 4: Validar JPA Mapping
    Tiempo: 2 horas
    
    Cuando Pep cree las Entity classes:
    1. Revisar que @Table(name=...) apunta a tabla correcta
    2. Revisar que @Column(name=...) mapea columnas correctas
    3. Validar tipos de datos Java vs MySQL
    4. Validar relaciones @OneToMany, @ManyToOne
    
    Feedback a Pep: ¿Está todo correcto?

[ ] Tarea 5: Test conexión JDBC
    Tiempo: 2 horas
    
    Cuando Pep tenga application.properties configurado:
    1. mvn spring-boot:run
    2. Ver en logs: "HikariPool-1 - Starting..."
    3. Ver: "Hibernate: information_schema..."
    4. Escribir simple SQL para verificar
       SELECT * FROM usuario LIMIT 1;
    5. Verificar que no hay timeout/connection errors
    
    Resultado: "BD connection works" ✓
```

**SEMANA 2-3: (Ongoing)**

```
[ ] Tarea 6: Identificar problemas de performance
    - Analizar queries lentas
    - Proponer índices
    - Optimizar N+1 queries
    - Sugerir eager loading si necesario

[ ] Tarea 7: Data seeding
    - Crear datos de prueba en tablas
    - 5-10 rutas de ejemplo
    - Usuarios de prueba
    - Favoritos de ejemplo
```

### 📞 Coordina Con

```
Pep (Backend):
- Proporciona credenciales para application.properties
- Revisas sus Entity classes
- Validas su mapping JPA

Usuario:
- Pedir credenciales de BD remota
- Pedir permiso para crear/modificar datos
```

### Documentación Clave

```
1. DIAGRAMA_TECNICO.md → Data Layer (schema)
2. Archivo rutas_app.sql (en repositorio)
3. application.properties (cuando lo crees)
```

---

## 🟢 AGENTE: ANI/JESS (Frontend Expert)

### Tu Misión

Crear capa HTTP de React para conectar con backend, y actulizar UI con datos reales.

### Tu Tareas Inmediatas (en orden)

**SEMANA 1 - Día 1-2: (6 horas)**

```
BLOQUEADO: No comiences hasta que Pep tenga AuthController funcionando en Postman

[ ] Tarea 1: Instalar dependencias
    Tiempo: 15 min
    cd /Users/david/workspace/TFG_DAW/tfg_adventure
    npm install axios
    
    Verificar: npm list axios

[ ] Tarea 2: Crear API client
    Referencia: ARQUITECTURA_INTEGRACION.md → Fase 3.2
    Tiempo: 45 min
    
    Archivo: src/api/client.ts
    - Axios instance con baseURL
    - Interceptor para agregar token JWT
    - Interceptor para manejar errores 401
    - Test: console.log para verificar
    
    Validar: Compilar sin errores (npm run build)

[ ] Tarea 3: Crear authService.ts
    Referencia: ARQUITECTURA_INTEGRACION.md → Fase 3.2
    Tiempo: 1 hora
    
    Archivo: src/services/authService.ts
    
    Funciones:
    - register(email, password, nombre)
    - login(email, password)
    - logout()
    - getCurrentUser()
    - isAuthenticated()
    
    Usar client.ts para hacer llamadas HTTP
    Guardar/limpiar localStorage

[ ] Tarea 4: Actualizar AuthContext
    Referencia: ARQUITECTURA_INTEGRACION.md → Fase 3.4
    Tiempo: 1.5 horas
    
    Archivo: src/context/AuthContext.tsx
    
    - useCallback para login/register/logout
    - useEffect para cargar usuario al montar
    - Estado: usuario, isAuthenticated, isLoading
    - Integración con authService.ts
    
    Test: usar React DevTools para ver estado

[ ] Tarea 5: Crear .env.local
    Tiempo: 15 min
    
    Archivo: tfg_adventure/.env.local
    VITE_API_URL=http://localhost:8080/api

[ ] Tarea 6: Test básico
    Tiempo: 1 hora
    
    - npm run dev
    - Abrir http://localhost:5173
    - Probar que authService.login() hace request correcto
    - Ver en DevTools → Network tab la llamada
    - Verificar que falla con error correcto (conexión rechazada si backend no está)
```

**SEMANA 1 - Día 3-4: (6 horas)**

```
[ ] Tarea 7: Crear/actualizar LoginPage
    Referencia: ARQUITECTURA_INTEGRACION.md → Fase 3
    Tiempo: 1.5 horas
    
    Archivo: src/pages/LoginPage.tsx
    
    Features:
    - Formulario email + password
    - Validaciones básicas
    - Llamar authContext.login()
    - Mostrar errores si falla
    - Redireccionar a "/" si éxito
    - Botón a RegisterPage
    - Estilos con Tailwind
    
    Validar: Navegar a /login y ver formulario
    Test: Intentar login (fallará si backend no está, OK)

[ ] Tarea 8: Crear/actualizar RegisterPage
    Tiempo: 1.5 horas
    
    Archivo: src/pages/RegisterPage.tsx
    
    Features:
    - Formulario email + password + confirmPassword + nombre
    - Validaciones (password === confirmPassword)
    - Llamar authContext.register()
    - Mostrar errores
    - Redireccionar a login si éxito
    - Botón a LoginPage
    
    Validar: Formulario funciona y se ve bien

[ ] Tarea 9: Actualizar Header.tsx
    Tiempo: 1.5 horas
    
    Features:
    - Mostrar nombre usuario si autenticado
    - Mostrar botón logout si autenticado
    - Mostrar botones login/register si NO autenticado
    - Responsive design
    - Integrar con AuthContext
    
    Validar: Header cambia según estado auth

[ ] Tarea 10: Crear ProtectedRoute.tsx
    Tiempo: 45 min
    
    Componente wrapper para rutas que requieren autenticación
    - Si no autenticado → redirige a /login
    - Si autenticado → muestra componente
    
    Uso:
    <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />

[ ] Tarea 11: Test E2E Login Completo
    Tiempo: 2 horas
    
    PRERREQUISITO: Backend con /auth endpoints funcionando
    
    Pasos:
    1. npm run dev (start React)
    2. Backend en otra terminal: mvn spring-boot:run
    3. Navegar a http://localhost:5173/register
    4. Completar registro con datos nuevos
    5. Verificar usuario en BD (PhpMyAdmin)
    6. Navegar a /login
    7. Hacer login con mismo usuario
    8. Verificar que localStorage contiene "token"
    9. Verificar AuthContext.usuario tiene datos
    10. Header muestra nombre usuario
    
    Éxito: Todo funciona sin errores
```

**SEMANA 2: (6 horas)**

```
[ ] Tarea 12: Crear rutaService.ts
    Tiempo: 45 min
    
    Funciones:
    - getRutas(page, limit, filters)
    - getRutaById(id)
    - createRuta(ruta) - solo admin
    - updateRuta(id, ruta) - solo admin
    - deleteRuta(id) - solo admin
    - downloadGpx(id)

[ ] Tarea 13: Actualizar HomePage.tsx
    Tiempo: 2 horas
    
    - useEffect para cargar rutas con rutaService.getRutas()
    - Mostrar lista de rutas en cards
    - Paginación
    - Filtros (dificultad, distancia)
    - Link a detalle (/ruta/:id)
    
    Validar: Ve lista de rutas desde BD

[ ] Tarea 14: Actualizar InfoPage.tsx
    Tiempo: 2 horas
    
    - Cargar ruta por ID desde URL
    - Mostrar detalles
    - Botón descargar GPX
    - Sección comentarios (frontend)
    
    Validar: Puedes ver detalles de una ruta

[ ] Tarea 15: Crear favoritoService.ts
    Tiempo: 30 min
    - getFavoritos()
    - addFavorito(idRuta)
    - removeFavorito(idRuta)
    - isFavorito(idRuta)

[ ] Tarea 16: Actualizar FavoritesPage.tsx
    Tiempo: 1.5 horas
    - Mostrar lista de favoritos
    - Botón para remover
    - Link a detalle
```

### 🛠 Herramientas

```
Editor: VS Code
Frontend framework: React 19
Build tool: Vite
CSS: Tailwind CSS
HTTP Client: Axios
Router: React Router v7
Testing: Vitest (opcional)
```

### 📞 Coordina Con

```
Pep (Backend):
- ¿Cuándo AuthController estará listo?
- Verificar DTOs de request/response
- Reportar si endpoints tienen bugs

BLOQUEADORES:
- No puedes hacer login sin /auth endpoints
- No puedes hacer rutas sin /rutas endpoints
```

### Documentación Clave

```
1. ARQUITECTURA_INTEGRACION.md → Fase 3
2. DIAGRAMA_TECNICO.md → Front-End Layer
3. GUIA_AGENTS.md → Tu sección
```

---

## 📞 COMUNICACIÓN RECOMENDADA

```
DIARIO:
- 09:00 AM: Standup de 15 min (Pep, Sabrina, Ani/Jess)
- Resto del día: Trabajo independiente
- 17:00 PM: Checkin opcional

SLACK/EMAIL:
- Pep a Sabrina: "¿Credenciales de BD?"
- Sabrina a Pep: "Datos listos en CREDENCIALES.md"
- Pep a Ani/Jess: "AuthController listo para testear"
- Ani/Jess a Pep: "Encontré bug en response de login"

BLOQUEOS:
- Si estás bloqueado por otro agente, reporta en el standup
- Trata de hacer tareas en paralelo cuando sea posible
```

---

**Versión:** 1.0
**Fecha:** 7 de abril de 2026
**Copia el contenido de tu agente y comienza a trabajar**
