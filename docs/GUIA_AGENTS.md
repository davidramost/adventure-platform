# 🎯 GUÍA RÁPIDA PARA AGENTS - TFG Backend Integration

**Proyecto:** ProfesionalHosting (MySQL) ↔ tfg_backend (Spring Boot) ↔ tfg_adventure (React)

---

## 📌 TAREAS PRIORITARIAS POR AGENT

### **AGENTE: Pep (Spring Boot Expert)**

Tu objetivo: Implementar la estructura completa del backend Spring Boot

#### **TAREAS INMEDIATAS:**

1. **Actualizar `pom.xml`**
   - Agregar: MySQL Connector, JWT, Validation, Lombok
   - Referencia: Ver `ARQUITECTURA_INTEGRACION.md` - Fase 1.1

2. **Crear `application.properties` mejorado**
   - Configurar conexión a BD (será proporcionada por el usuario)
   - Configurar CORS
   - Configurar JWT
   - Referencia: Ver `ARQUITECTURA_INTEGRACION.md` - Fase 1.2

3. **Crear Entity Classes** (en `src/main/java/com/example/tfg_backend/entity/`)
   - `Usuario.java` (id, nombre, email, password, fechaRegistro)
   - `Ruta.java` (id, nombre, descripcion, dificultad, distancia, etc)
   - `Favorito.java` (id_ruta, id_usuario)
   - `Mensaje.java` (id, contenido, fecha, id_usuario, id_ruta)
   - `Producto.java`, `Pedido.java`, `LineaPedido.java`, etc.
   - **Consulta la BD remota para el esquema exacto en PhpMyAdmin**

4. **Crear Repository Interfaces** (en `src/main/java/com/example/tfg_backend/repository/`)
   - Extender `JpaRepository<Entity, ID>`
   - Métodos custom para búsquedas comunes
   - Usar `@Query` si es necesario

5. **Crear DTO Classes** (en `src/main/java/com/example/tfg_backend/dto/`)
   - `LoginRequest.java` → `{ email, password }`
   - `LoginResponse.java` → `{ token, usuario: { id, nombre, email } }`
   - `RegisterRequest.java` → `{ email, password, nombre }`
   - `RutaDto.java`, `UsuarioDto.java`, etc.

6. **Crear Service Classes** (en `src/main/java/com/example/tfg_backend/service/`)
   - `UsuarioService.java` → CRUD usuarios
   - `RutaService.java` → CRUD rutas con filtros
   - `AuthService.java` → Lógica de login/registro
   - `FavoritoService.java`, `MensajeService.java`, etc.

7. **Crear Controller Classes** (en `src/main/java/com/example/tfg_backend/controller/`)
   - `AuthController.java` → POST /auth/login, /auth/register
   - `RutaController.java` → GET/POST/PUT/DELETE /rutas
   - `FavoritoController.java` → GET/POST/DELETE /favoritos
   - `MensajeController.java`, `ProductoController.java`, etc.
   - **Todos deben retornar ResponseEntity con status correcto**

8. **Crear Configuration Classes** (en `src/main/java/com/example/tfg_backend/config/`)
   - `CorsConfig.java` → Configurar CORS (ver template en Fase 1.3)
   - `SecurityConfig.java` → Spring Security + JWT (ver template en Fase 4.1)
   - `JwtConfig.java` → Configuración JWT

9. **Crear Security Classes** (en `src/main/java/com/example/tfg_backend/security/`)
   - `JwtTokenProvider.java` → Generar y validar tokens (ver template en Fase 4.2)
   - `JwtAuthenticationFilter.java` → Filtro para validar tokens en headers
   - `UserDetailsServiceImpl.java` → Implementación de UserDetailsService

10. **Crear Exception Handler** (en `src/main/java/com/example/tfg_backend/exception/`)
    - `GlobalExceptionHandler.java` → Manejo centralizado de errores
    - Excepciones custom: `ResourceNotFoundException`, `UnauthorizedException`

11. **Registrar dependencias y clases en `TfgBackendApplication.java`**
    - Asegurar que Spring Boot escanee los paquetes correctos

---

### **AGENTE: Sabrina (Database Expert)**

Tu objetivo: Verificar y optimizar la conexión a la BD remota

#### **TAREAS:**

1. **Verificar Conexión:**
   - Confirmar que el hosting permite conexiones JDBC remotas
   - Probar credenciales de BD
   - Puerto MySQL (usualmente 3306)

2. **Revisar Schema Actual en PhpMyAdmin:**
   - Proporcionar al equipo el DDL exacto de cada tabla
   - Identificar constraints, indexes, PKs y FKs
   - Notar cualquier inconsistencia

3. **Mapper JPA/Entity:**
   - Asegurar que `@Entity` maps correctamente cada tabla
   - Configurar `@Table(name="nombre_tabla")`
   - Validar `@Column` mappings
   - Configurar relaciones con `@OneToMany`, `@ManyToOne`, etc.

4. **Optimizaciones (opcional para Fase 1):**
   - Sugerir índices si es necesario
   - Identificar N+1 queries y usar `@EntityGraph`

5. **Archivo de Properties Actualizado:**
   - Proporcionar valores reales: host, puerto, usuario, password

---

### **AGENTE: Ani/Jess (Frontend Specialists)**

Tu objetivo: Crear la capa HTTP y actualizar componentes React

#### **TAREAS:**

1. **Crear API Client** (`src/api/client.ts`)
   - Axios con baseURL configurado
   - Interceptors para token JWT en headers
   - Manejo de errores 401

2. **Crear Services HTTP** (carpeta `src/services/`)
   - `authService.ts` → login, register, logout, getCurrentUser
   - `rutaService.ts` → getRutas, getRutaById, createRuta, etc.
   - `favoritoService.ts` → getFavoritos, addFavorito, removeFavorito
   - `productoService.ts`, `mensajeService.ts`, etc.
   - Usar patrón similar a LoginRequest/Response DTOs del backend

3. **Actualizar AuthContext** (`src/context/AuthContext.tsx`)
   - Integrar con `authService`
   - Guardar token en localStorage
   - Manejar refresh de usuario al cargar

4. **Crear componentes de autenticación:**
   - `LoginPage.tsx` → Formulario login
   - `RegisterPage.tsx` → Formulario registro
   - `ProtectedRoute.tsx` → Wrapper para rutas protegidas
   - `LogoutButton.tsx` → Botón de logout

5. **Actualizar páginas existentes:**
   - `HomePage.tsx` → Llamar a `rutaService.getRutas()`
   - `CategoryPage.tsx` → Filtros con API
   - `InfoPage.tsx` → Details de ruta desde API
   - `FavoritesPage.tsx` → Llamar a `favoritoService.getFavoritos()`

6. **Configuración `.env.local`:**
   - `VITE_API_URL=http://localhost:8080/api` (desarrollo)
   - Cambiar en `.env.production` para producción

7. **Testing:**
   - Verificar que API client se conecta correctamente
   - Probar autenticación end-to-end
   - Validar manejo de errores

---

## 🔗 FLUJO DE INTEGRACIÓN

```
Usuario en React (tfg_adventure)
    ↓
    POST /auth/login (email, password)
    ↓
Spring Boot AuthController
    ↓
Consulta BD: SELECT * FROM usuario WHERE email = ?
    ↓
Valida password con BCrypt
    ↓
Genera JWT Token (JwtTokenProvider)
    ↓
Retorna { token, usuario { id, nombre, email } }
    ↓
React guarda token en localStorage
    ↓
En próximas requests:
    Header: Authorization: Bearer <token>
    ↓
JwtAuthenticationFilter valida token
    ↓
Procesa request normal
```

---

## 📊 PRIORIDADES

### **Fase 1 - CRÍTICA (esta semana):**

- [x] Plan definido
- [ ] `pom.xml` actualizado (Pep)
- [ ] `application.properties` configurado (Pep + Sabrina)
- [ ] Entity classes creadas (Pep + Sabrina)
- [ ] Repository interfaces creadas (Pep)
- [ ] AuthService + AuthController funcionando (Pep)
- [ ] JWT funcional (Pep)
- [ ] API Client en React (Ani/Jess)
- [ ] TestLogin e-2-e (Todos)

### **Fase 2 - IMPORTANTE (siguiente semana):**

- [ ] Controllers de rutas, favoritos, mensajes (Pep)
- [ ] Services de rutas, favoritos, mensajes (Pep)
- [ ] Páginas React actualizadas (Ani/Jess)
- [ ] Validaciones en backend (Pep)
- [ ] Tests unitarios (Pep)

### **Fase 3 - NICE-TO-HAVE:**

- [ ] Optimizaciones BD (Sabrina)
- [ ] Deployment (Todos)
- [ ] Documentación de API (Todos)

---

## 🛠 HERRAMIENTAS RECOMENDADAS

**Testing de endpoints:**

- Postman / Insomnia
- Thunder Client (VS Code extension)

**Debugging:**

- Spring Boot Debugger en VS Code
- Browser DevTools (Network tab)

**Monitoreo:**

- MySQL Workbench (para ver queries)
- Logs en `application.properties`

---

## ⚠️ PUNTOS CRÍTICOS A RECORDAR

1. **CORS:** Debe estar configurado correctamente para que React pueda llamar al backend
2. **JWT:** La clave secreta debe ser robusta (256+ bits)
3. **Passwords:** Siempre hash con BCrypt, NUNCA plaintext
4. **Tokens:** Siempre en headers Authorization, NUNCA en URLs
5. **HTTPS en Producción:** Cambiar URLs de localhost a dominio seguro
6. **Tiempos de expiración:** Configure según política de seguridad

---

## 📞 CONTACTO ENTRE AGENTS

- **Pep y Sabrina:** Para resolver issues de BD/JPA
- **Pep y Ani/Jess:** Para validar DTOs y contratos de API
- **Sabrina y Ani/Jess:** Para optimizar queries desde frontend

---

**Versión:** 1.0
**Fecha:** 7 de abril de 2026
**Estado:** Listo para implementación
