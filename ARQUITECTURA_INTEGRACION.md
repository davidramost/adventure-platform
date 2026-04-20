# Plan Integral de Integración: ProfesionalHosting + Spring Boot + React

**Fecha de creación:** 7 de abril de 2026
**Estado:** Plan de Implementación

---

## 📋 Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [Fase 1: Configuración del Backend (Spring Boot)](#fase-1-configuración-del-backend-spring-boot)
3. [Fase 2: Endpoints REST](#fase-2-endpoints-rest)
4. [Fase 3: Configuración del Frontend (React)](#fase-3-configuración-del-frontend-react)
5. [Fase 4: Autenticación y Seguridad](#fase-4-autenticación-y-seguridad)
6. [Fase 5: Deployment](#fase-5-deployment)
7. [Diagrama de Flujo](#diagrama-de-flujo)

---

## 🏗 Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (React)                          │
│  tfg_adventure (React + TypeScript + Tailwind + React Router)   │
│                                                                   │
│  - ./src/pages/*Page.tsx (HomePage, LoginPage, etc.)            │
│  - ./src/components/* (Header, Footer, etc.)                    │
│  - ./src/context/AuthContext.tsx (Gestión de sesiones)         │
└────────────┬────────────────────────────────────────────────────┘
             │
             │ HTTP/REST (XMLHttpRequest / Fetch API)
             │ CORS habilitado
             │
┌────────────▼────────────────────────────────────────────────────┐
│                    SERVIDOR API (Spring Boot)                    │
│                    tfg_backend (Java + Spring)                   │
│                                                                   │
│  - Controllers (REST Endpoints)                                  │
│    - AuthController (/api/auth/login, /api/auth/register)      │
│    - RutaController (/api/rutas/*)                              │
│    - UsuarioController (/api/usuarios/*)                        │
│    - FavoritoController (/api/favoritos/*)                      │
│    - MensajeController (/api/mensajes/*)                        │
│    - ProductoController (/api/productos/*)                      │
│                                                                   │
│  - Services (Lógica de negocio)                                  │
│  - Repositories (JPA / Acceso a BD)                             │
│  - Entities (Modelos de datos)                                   │
│  - Security Config (JWT / Spring Security)                      │
└────────────┬────────────────────────────────────────────────────┘
             │
             │ JDBC / Connector/J
             │
┌────────────▼────────────────────────────────────────────────────┐
│                     BASE DE DATOS REMOTA                         │
│              ProfesionalHosting - PhpMyAdmin                     │
│                   BD: rutas_app (MySQL)                          │
│                                                                   │
│  Tablas:                                                          │
│  - usuario (id, nombre, email, password, fecha_registro)        │
│  - ruta (id, nombre, descripcion, dificultad, distancia, etc)  │
│  - favorito (id_ruta, id_usuario)                              │
│  - me_gusta (id_ruta, id_usuario)                              │
│  - mensaje (id, contenido, fecha_hora, id_usuario, id_ruta)    │
│  - producto (id, nombre, descripcion, precio, stock, etc)      │
│  - pedido (id, fecha, total, id_usuario)                       │
│  - linea_pedido (id_pedido, id_producto, cantidad, etc)        │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Fase 1: Configuración del Backend (Spring Boot)

### 1.1 Actualizar `pom.xml` - Agregar Dependencias

**Dependencias a agregar:**

```xml
<!-- MySQL Connector -->
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version>
</dependency>

<!-- Spring Boot Web (REST) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Validation -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>

<!-- JWT Token (para autenticación) -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>

<!-- Lombok (para reducir boilerplate) -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>

<!-- DevTools (desarrollo) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

### 1.2 Configurar `application.properties` - Conexión a BD Remota

```properties
# Spring Boot Application
spring.application.name=tfg_backend

# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Database Configuration
spring.datasource.url=jdbc:mysql://<HOST_HOSTING>:<PUERTO>/rutas_app?serverTimezone=UTC&useSSL=true&useUnicode=true&characterEncoding=utf-8
spring.datasource.username=<USUARIO_BD>
spring.datasource.password=<PASSWORD_BD>
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# Connection Pool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=20000

# JWT Configuration
jwt.secret=your-secret-key-change-in-production-with-at-least-256-bits
jwt.expiration=86400000

# CORS Configuration
cors.allowed-origins=http://localhost:5173,https://your-frontend-domain.com
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed-headers=*
cors.allow-credentials=true
cors.max-age=3600

# Logging
logging.level.root=INFO
logging.level.com.example.tfg_backend=DEBUG
```

**⚠️ IMPORTANTE:**

- Reemplaza `<HOST_HOSTING>`, `<PUERTO>`, `<USUARIO_BD>`, `<PASSWORD_BD>` con los datos reales de tu hosting
- En producción, usa variables de entorno en lugar de valores hardcodeados
- Usa una clave JWT segura y única (mínimo 256 caracteres)

### 1.3 Crear Clase de Configuración CORS

**Archivo:** `src/main/java/com/example/tfg_backend/config/CorsConfig.java`

```java
package com.example.tfg_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    @Value("${cors.allowed-methods}")
    private String allowedMethods;

    @Value("${cors.max-age}")
    private long maxAge;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins.split(","))
                .allowedMethods(allowedMethods.split(","))
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(maxAge);
    }
}
```

---

## 📡 Fase 2: Endpoints REST

### 2.1 Estructura de Carpetas (Crear)

```
src/main/java/com/example/tfg_backend/
├── config/
│   ├── CorsConfig.java
│   ├── SecurityConfig.java
│   └── JwtConfig.java
├── controller/
│   ├── AuthController.java
│   ├── RutaController.java
│   ├── UsuarioController.java
│   ├── FavoritoController.java
│   ├── MensajeController.java
│   └── ProductoController.java
├── service/
│   ├── UsuarioService.java
│   ├── RutaService.java
│   ├── AuthService.java
│   ├── FavoritoService.java
│   ├── MensajeService.java
│   └── ProductoService.java
├── repository/
│   ├── UsuarioRepository.java
│   ├── RutaRepository.java
│   ├── FavoritoRepository.java
│   ├── MensajeRepository.java
│   └── ProductoRepository.java
├── entity/
│   ├── Usuario.java
│   ├── Ruta.java
│   ├── Favorito.java
│   ├── Mensaje.java
│   ├── MeGusta.java
│   ├── Producto.java
│   ├── Pedido.java
│   └── LineaPedido.java
├── dto/
│   ├── LoginRequest.java
│   ├── LoginResponse.java
│   ├── RegisterRequest.java
│   ├── UsuarioDto.java
│   ├── RutaDto.java
│   ├── MensajeDto.java
│   └── ProductoDto.java
├── exception/
│   ├── ResourceNotFoundException.java
│   ├── UnauthorizedException.java
│   └── GlobalExceptionHandler.java
├── security/
│   ├── JwtTokenProvider.java
│   ├── JwtAuthenticationFilter.java
│   └── UserDetailsServiceImpl.java
└── TfgBackendApplication.java
```

### 2.2 Endpoints Por Implementar

#### **AUTENTICACIÓN**

- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login (retorna JWT)
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Renovar token

#### **RUTAS**

- `GET /api/rutas` - Obtener todas las rutas (con paginación/filtros)
- `GET /api/rutas/{id}` - Obtener ruta por ID
- `POST /api/rutas` - Crear nueva ruta (admin)
- `PUT /api/rutas/{id}` - Actualizar ruta (admin)
- `DELETE /api/rutas/{id}` - Eliminar ruta (admin)
- `GET /api/rutas/{id}/download` - Descargar GPX

#### **USUARIOS**

- `GET /api/usuarios/{id}` - Obtener perfil usuario
- `PUT /api/usuarios/{id}` - Actualizar perfil
- `DELETE /api/usuarios/{id}` - Eliminar cuenta

#### **FAVORITOS**

- `GET /api/favoritos` - Obtener favoritos del usuario
- `POST /api/favoritos/{idRuta}` - Agregar a favoritos
- `DELETE /api/favoritos/{idRuta}` - Remover de favoritos

#### **ME GUSTA**

- `POST /api/me-gusta/{idRuta}` - Dar like
- `DELETE /api/me-gusta/{idRuta}` - Remover like
- `GET /api/rutas/{idRuta}/likes-count` - Contar likes

#### **MENSAJES / COMENTARIOS**

- `GET /api/rutas/{idRuta}/mensajes` - Obtener comentarios
- `POST /api/rutas/{idRuta}/mensajes` - Crear comentario
- `DELETE /api/mensajes/{id}` - Eliminar comentario

#### **PRODUCTOS**

- `GET /api/productos` - Obtener productos
- `GET /api/productos/{id}` - Obtener detalle producto
- `GET /api/productos/categoria/{categoria}` - Filtrar por categoría

#### **PEDIDOS**

- `POST /api/pedidos` - Crear pedido
- `GET /api/pedidos/{id}` - Obtener pedido
- `GET /api/pedidos` - Obtener pedidos del usuario

---

## 🎨 Fase 3: Configuración del Frontend (React)

### 3.1 Agregar Herramientas HTTP

**Instalar Axios:**

```bash
cd /Users/david/workspace/TFG_DAW/tfg_adventure
npm install axios
```

**package.json (devDependencies a agregar):**

```json
{
  "devDependencies": {
    "@types/axios": "^0.14.0"
  }
}
```

### 3.2 Crear API Client (`src/api/client.ts`)

```typescript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejo de errores
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar token y redirigir a login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
```

### 3.3 Crear Servicios API (`src/services/`)

**Estructura:**

```
src/services/
├── authService.ts      (login, register, logout)
├── rutaService.ts      (CRUD rutas)
├── usuarioService.ts   (perfil de usuario)
├── favoritoService.ts  (favoritos)
├── mensajeService.ts   (comentarios)
└── productoService.ts  (productos)
```

**Ejemplo: `src/services/authService.ts`**

```typescript
import client from '../api/client';

export const authService = {
  register: async (email: string, password: string, nombre: string) => {
    const response = await client.post('/auth/register', {
      email,
      password,
      nombre,
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await client.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  getCurrentUser: () => {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};
```

### 3.4 Actualizar AuthContext (`src/context/AuthContext.tsx`)

```typescript
import { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  fechaRegistro?: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nombre: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay usuario guardado
    const usuarioGuardado = authService.getCurrentUser();
    if (usuarioGuardado) {
      setUsuario(usuarioGuardado);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { usuario, token } = await authService.login(email, password);
    setUsuario(usuario);
    localStorage.setItem('token', token);
  };

  const register = async (email: string, password: string, nombre: string) => {
    const { usuario, token } = await authService.register(email, password, nombre);
    setUsuario(usuario);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    authService.logout();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isAuthenticated: !!usuario,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

### 3.5 Crear `.env.local` para Configuración

```env
VITE_API_URL=http://localhost:8080/api
```

Para producción:

```env
VITE_API_URL=https://tu-backend-production.com/api
```

---

## 🔐 Fase 4: Autenticación y Seguridad

### 4.1 Configuración de Spring Security

**Archivo:** `src/main/java/com/example/tfg_backend/config/SecurityConfig.java`

```java
package com.example.tfg_backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.tfg_backend.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder())
                .and()
                .build();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/rutas/**").permitAll()
                        .requestMatchers("/api/productos/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

### 4.2 Proveedor JWT

**Archivo:** `src/main/java/com/example/tfg_backend/security/JwtTokenProvider.java`

```java
package com.example.tfg_backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
```

---

## 🚀 Fase 5: Deployment

### 5.1 Compilar Backend

```bash
cd /Users/david/workspace/TFG_DAW/tfg_backend
mvn clean package -DskipTests
```

Genera: `target/tfg_backend-0.0.1-SNAPSHOT.jar`

### 5.2 Ejecutar Backend

```bash
java -jar target/tfg_backend-0.0.1-SNAPSHOT.jar
```

Accesible en: `http://localhost:8080`

### 5.3 Compilar Frontend

```bash
cd /Users/david/workspace/TFG_DAW/tfg_adventure
npm run build
```

Genera: `dist/` (carpeta de distribución)

### 5.4 Deployment a Producción

**Opción A: En tu hosting profesional (si soporta Java)**

- Sube el JAR a una carpeta del servidor
- Configura variables de entorno
- Usa un gestor de procesos (PM2, systemd, etc.)

**Opción B: Usar Docker**

Crea `Dockerfile` en tfg_backend:

```dockerfile
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY target/tfg_backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

---

## 📊 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO EN NAVEGADOR                      │
│                   tfg_adventure (React)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  1. Usa authService.login()    │
        │  (axios.post('/auth/login'))   │
        └────────────┬───────────────────┘
                     │
                     ▼
        ┌────────────────────────────────┐
        │   Spring Boot Controller        │
        │   AuthController.login()       │
        └────────────┬───────────────────┘
                     │
                     ▼
        ┌────────────────────────────────┐
        │   AuthService.authenticate()   │
        │   - Verifica BD (Usuario tabla)│
        │   - Genera JWT Token           │
        └────────────┬───────────────────┘
                     │
                     ▼
        ┌────────────────────────────────┐
        │   Retorna JWT Token + Datos    │
        │   localStorage.setItem('token')│
        └────────────┬───────────────────┘
                     │
                     ▼
        ┌────────────────────────────────┐
        │  Usuario Autenticado            │
        │  - Puede acceder a endpoints    │
        │  - token se incluye en headers  │
        └────────────────────────────────┘
```

---

## ✅ Checklist de Implementación

### Backend (Spring Boot)

- [ ] Actualizar `pom.xml` con dependencias
- [ ] Configurar `application.properties` con datos reales
- [ ] Crear estructura de carpetas (config, controller, service, etc.)
- [ ] Implementar Entity classes (Usuario, Ruta, etc.)
- [ ] Implementar Repository interfaces (JPA)
- [ ] Crear DTO classes para requests/responses
- [ ] Implementar Services (lógica de negocio)
- [ ] Implementar Controllers (REST endpoints)
- [ ] Configurar CORS en CorsConfig
- [ ] Implementar JWT Security (JwtTokenProvider, JwtFilter, SecurityConfig)
- [ ] Implementar ExceptionHandler
- [ ] Escribir tests unitarios (sugerido)
- [ ] Probar endpoints con Postman/Insomnia

### Frontend (React)

- [ ] Instalar dependencias (axios)
- [ ] Crear API client (`src/api/client.ts`)
- [ ] Crear servicios HTTP (`src/services/`)
- [ ] Actualizar AuthContext
- [ ] Implementar páginas (LoginPage, RegisterPage, etc.)
- [ ] Agregar manejo de errores
- [ ] Configurar `.env.local` con URL del backend
- [ ] Probar autenticación y flujos principales
- [ ] Usar TailwindCSS para estilos

### Configuración General

- [ ] Variables de entorno en `application.properties`
- [ ] CORS correctamente configurado
- [ ] JWT token funcional
- [ ] Conexión a BD remota verificada
- [ ] Tests de integración backend-frontend
- [ ] Plan de deployment definido

---

## 📚 Recursos Útiles

- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Spring Security](https://spring.io/projects/spring-security)
- [React Docs](https://react.dev)
- [React Router](https://reactrouter.com)
- [Axios Docs](https://axios-http.com)
- [MySQL Connector/J](https://dev.mysql.com/doc/connector-j/en/)
- [JWT.io](https://jwt.io) - Token testing

---

## 🤖 Próximos Pasos con Agents

1. **Pep** (Spring Boot expert):
   - Implementar estructura Spring Boot
   - Crear entities y repositories
   - Implementar controllers y services
   - Configurar seguridad JWT

2. **Sabrina** (Database expert):
   - Verificar conexión a BD remota
   - Optimizar queries
   - Diseñar índices
   - Migración de datos si es necesario

3. **Ani/Jess** (Frontend specialists):
   - Implementar servicios HTTP
   - Actualizar componentes React
   - Integración con API
   - Testing y validación

---

**Última actualización:** 7 de abril de 2026
**Próxima revisión sugerida:** Después de completar Fase 2
