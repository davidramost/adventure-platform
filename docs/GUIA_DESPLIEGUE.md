# 📋 Guía de Despliegue: TFG Adventure

**Objetivo:** Desplegar la aplicación completa en producción, **100% gratuita para siempre:**

- **Frontend (React)** → ProfesionalHosting (FTP)
- **Backend (Spring Boot + Docker)** → Render.com (free tier permanente)
- **Base de Datos MySQL** → TiDB Cloud Starter (free tier permanente, compatible MySQL 8)

---

## 🏗️ Arquitectura de Despliegue

```
┌─────────────────────────────────────┐
│  ProfesionalHosting (FTP)           │
│  https://davidr.cicloflorenciopintado.es │
│  ┌─────────────────────────────┐    │
│  │  React (dist/)              │    │
│  │  Archivos estáticos HTML/JS │    │
│  └──────────┬──────────────────┘    │
└─────────────┼───────────────────────┘
              │ HTTPS (API calls)
              ▼
┌─────────────────────────────────────┐
│  Render.com (Docker - Free)         │
│  https://tfg-backend-xxx.onrender.com │
│  ┌─────────────────────────────┐    │
│  │  Spring Boot (JAR en Docker)│    │
│  │  JWT + REST API             │    │
│  └──────────┬──────────────────┘    │
└─────────────┼───────────────────────┘
              │ JDBC (conexión directa)
              ▼
┌─────────────────────────────────────┐
│  TiDB Cloud Starter (Free Forever)  │
│  mysql://gateway.tidbcloud.com:4000 │
│  ┌─────────────────────────────┐    │
│  │  MySQL 8 compatible         │    │
│  │  5 GiB storage gratuito     │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

**Ventaja:** El backend se conecta **directamente** a la BD por JDBC. No hay proxy PHP, no hay intermediarios. Arquitectura limpia y profesional.

---

## 📋 Tabla de Contenidos

1. [Crear BD en TiDB Cloud Starter](#paso-1-crear-bd-en-tidb-cloud-starter)
2. [Importar datos a TiDB](#paso-2-importar-datos-a-tidb)
3. [Configurar Backend para TiDB](#paso-3-configurar-backend-para-conectar-con-tidb)
4. [Verificar Dockerfile](#paso-4-verificar-dockerfile)
5. [Desplegar Backend en Render.com](#paso-5-desplegar-backend-en-rendercom)
6. [Actualizar Frontend con URL del Backend](#paso-6-actualizar-frontend-con-url-del-backend)
7. [Build y subir Frontend a ProfesionalHosting](#paso-7-build-y-subir-frontend)
8. [Verificación Final](#paso-8-verificación-final)
9. [Solucionar Errores](#paso-9-troubleshooting)

---

## 🔄 Comparativa de Opciones Gratuitas (investigadas abril 2026)

### Para la Base de Datos compatible MySQL

| Servicio | ¿Gratis PARA SIEMPRE? | Compatible MySQL | Límites | Tarjeta Crédito |
|----------|----------------------|-----------------|---------|-----------------|
| **TiDB Cloud Starter** ⭐ | ✅ **Sí, permanente** | ✅ MySQL 8 wire-compatible | 5 GiB storage, 50M RUs/mes | ❌ No necesaria |
| Aiven.io | ❌ **Trial 30 días** → $25/mes | ✅ MySQL 8 | 1 GB disco | ❌ No necesaria |
| Clever Cloud | ❌ **Solo créditos iniciales** | ✅ MySQL real | — | ❌ No necesaria |
| Railway | ❌ **Trial $5** luego pago | ✅ MySQL real | — | ✅ Eventualmente |
| Neon.tech | ✅ Permanente | ❌ **PostgreSQL** (no MySQL) | 512 MB | ❌ No necesaria |

### Para el Backend (Spring Boot + Docker)

| Servicio | ¿Gratis PARA SIEMPRE? | Docker | Limitaciones | Tarjeta Crédito |
|----------|----------------------|--------|-------------|-----------------|
| **Render.com** ⭐ | ✅ **Sí, permanente** | ✅ | Cold start ~30-60s tras 15 min inactivo | ❌ No necesaria |
| Koyeb | ✅ Permanente | ✅ | 0.1 vCPU, 512 MB RAM (muy justo para Spring Boot) | ❌ No necesaria |
| Railway | ❌ Trial $5 | ✅ | Se acaba el crédito | ✅ Eventualmente |

> ### 🏆 Recomendación Final
> **Render.com (backend) + TiDB Cloud Starter (BD)** = la combinación más estable, gratuita y sin trampas. Sin trials, sin tarjeta, sin sorpresas.

---

## **PASO 1: Crear BD en TiDB Cloud Starter**

### 1.1: Crear cuenta en TiDB Cloud

1. Ve a [https://tidbcloud.com](https://tidbcloud.com)
2. Regístrate con **GitHub**, **Google** o email (**no pide tarjeta de crédito**)
3. Confirma tu email

### 1.2: Crear cluster MySQL gratuito

1. En el dashboard, pulsa **"Create Cluster"**
2. Selecciona **"Starter"** (antes llamado "Serverless") — es el plan gratuito
3. **Cluster Name:** `tfg-adventure`
4. **Cloud Provider:** AWS o Google Cloud
5. **Region:** Selecciona la más cercana a España (por ejemplo, `Frankfurt (eu-central-1)`)
6. Pulsa **"Create"**

⏳ **Espera 1-2 minutos** a que el cluster se ponga en estado "Available".

### 1.3: Crear la base de datos `rutas_app`

1. En tu cluster, ve a la pestaña **"SQL Editor"** (o "Chat2Query")
2. Ejecuta:

```sql
CREATE DATABASE rutas_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 1.4: Obtener credenciales de conexión

1. En tu cluster, pulsa **"Connect"** (botón arriba a la derecha)
2. Selecciona **"General"** como tipo de conexión
3. TiDB te mostrará los datos:

```
Host:     gateway01.eu-central-1.prod.aws.tidbcloud.com
Port:     4000
User:     xxxxxxxx.root
Password: (genera una password, cópiala y guárdala)
Database: rutas_app
```

> ⚠️ **IMPORTANTE:**
> - TiDB usa el puerto **4000** (no 3306 como MySQL normal)
> - El usuario tiene un prefijo con el ID del cluster (ejemplo: `3x5gABC1234.root`)
> - TiDB usa **TLS/SSL obligatorio**
> - **Apúntate la password** — solo se muestra una vez al crearla

---

## **PASO 2: Importar Datos a TiDB**

### 2.1: Importar con el cliente mysql

Si tienes el cliente MySQL instalado:

```bash
mysql --host=gateway01.eu-central-1.prod.aws.tidbcloud.com \
      --port=4000 \
      --user=xxxxxxxx.root \
      --password=TU_PASSWORD \
      --ssl-mode=VERIFY_IDENTITY \
      --ssl-ca=/etc/ssl/cert.pem \
      rutas_app < /Users/david/workspace/TFG_DAW/rutas_app.sql
```

> **En macOS**, el certificado CA suele estar en `/etc/ssl/cert.pem`. Si no funciona, prueba sin `--ssl-ca` y con `--ssl-mode=REQUIRED`.

### 2.2: Alternativa — Importar desde el Dashboard

Si el terminal da problemas, usa el **SQL Editor** del dashboard de TiDB Cloud:

1. Ve a tu cluster → **"SQL Editor"**
2. Selecciona la base de datos `rutas_app`
3. Copia y pega el contenido de `rutas_app.sql` en el editor
4. Pulsa **"Run"**

### 2.3: Alternativa — Import desde archivo

1. Ve a tu cluster → **"Import"**
2. Sube el archivo `rutas_app.sql`
3. Selecciona la base de datos `rutas_app`
4. TiDB lo importa automáticamente

### 2.4: Verificar la importación

En el SQL Editor:

```sql
USE rutas_app;
SHOW TABLES;
SELECT COUNT(*) FROM rutas;
```

> **Si no tienes el cliente `mysql` instalado:**
>
> ```bash
> brew install mysql-client
> ```

---

## **PASO 3: Configurar Backend para Conectar con TiDB**

### 3.1: Crear perfil de producción

Para no romper tu configuración local, crea un archivo de propiedades para producción:

**Ruta:** `tfg_backend/src/main/resources/application-prod.properties`

```properties
# === DATABASE (TiDB Cloud - Producción) ===
spring.datasource.url=jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}?sslMode=VERIFY_IDENTITY&useSSL=true&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# === JPA/HIBERNATE ===
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=false

# === JSON ===
spring.jackson.property-naming-strategy=SNAKE_CASE

# === JWT ===
jwt.secret=${JWT_SECRET:***JWT_SECRET_REMOVED***}
jwt.expiration=${JWT_EXPIRATION:86400000}

# === SERVER ===
server.port=${PORT:8080}
```

> **¿Por qué variables de entorno (`${DB_HOST}`, etc.)?**
> Porque NUNCA debes poner credenciales reales en el código que subes a GitHub. Las variables se configuran en Render.com como secretos.

### 3.2: Mantener tu `application.properties` local intacto

Tu archivo actual sigue funcionando para desarrollo local sin cambios:

```properties
# --- Este archivo es para DESARROLLO LOCAL ---
spring.datasource.url=jdbc:mysql://localhost:3306/rutas_app?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=
```

### 3.3: Actualizar el Dockerfile para activar el perfil de producción

Modifica el `ENTRYPOINT` del Dockerfile para activar el perfil `prod`:

**Ruta:** `tfg_backend/Dockerfile`

```dockerfile
# --- Etapa de Build ---
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copiar el pom.xml y descargar dependencias (se cachea)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiar el código fuente y construir el JAR
COPY src ./src
RUN mvn clean package -DskipTests

# --- Etapa de Runtime ---
FROM eclipse-temurin:17-jre-focal
WORKDIR /app

# Copiar el JAR desde la etapa de build
COPY --from=build /app/target/*.jar app.jar

# Exponer el puerto (Render lo sobreescribe con $PORT)
EXPOSE 8080

# Activar perfil de producción
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
```

---

## **PASO 4: Verificar Dockerfile**

Asegúrate de que el Dockerfile existe y es correcto:

```bash
cat /Users/david/workspace/TFG_DAW/tfg_backend/Dockerfile
```

**Opcional — probar Docker en local antes de subir:**

```bash
cd /Users/david/workspace/TFG_DAW/tfg_backend

# Build de la imagen (primera vez tarda ~3-5 min)
docker build -t tfg-backend .

# Ejecutar con las variables de TiDB
docker run -p 8080:8080 \
  -e DB_HOST=gateway01.eu-central-1.prod.aws.tidbcloud.com \
  -e DB_PORT=4000 \
  -e DB_NAME=rutas_app \
  -e DB_USER=xxxxxxxx.root \
  -e DB_PASSWORD=TU_PASSWORD_TIDB \
  -e JWT_SECRET=***JWT_SECRET_REMOVED*** \
  tfg-backend
```

Si ves `Started TfgBackendApplication` en los logs, todo funciona. **Ctrl+C** para parar.

---

## **PASO 5: Desplegar Backend en Render.com**

### 5.1: Crear cuenta en Render

1. Ve a [https://render.com](https://render.com)
2. Regístrate con **GitHub** (recomendado, así conecta tu repositorio directamente)
3. No pide tarjeta de crédito

### 5.2: Subir cambios a GitHub

```bash
cd /Users/david/workspace/TFG_DAW
git add .
git commit -m "Add production profile and TiDB Cloud config"
git push origin main
```

### 5.3: Crear Web Service en Render

1. En el dashboard, pulsa **"New +"** → **"Web Service"**
2. Conecta/selecciona tu repositorio GitHub (`TFG_DAW`)
3. Configura:

| Campo | Valor |
|-------|-------|
| **Name** | `tfg-backend` |
| **Region** | `Frankfurt (EU Central)` (la más cercana a TiDB) |
| **Root Directory** | `tfg_backend` |
| **Runtime** | `Docker` |
| **Instance Type** | `Free` |

### 5.4: Configurar Variables de Entorno

En la sección **"Environment Variables"**, añade las siguientes (con los valores reales de TiDB del PASO 1.4):

| Variable | Valor (ejemplo) |
|----------|-----------------|
| `DB_HOST` | `gateway01.eu-central-1.prod.aws.tidbcloud.com` |
| `DB_PORT` | `4000` |
| `DB_NAME` | `rutas_app` |
| `DB_USER` | `xxxxxxxx.root` |
| `DB_PASSWORD` | `TU_PASSWORD_TIDB` |
| `JWT_SECRET` | `***JWT_SECRET_REMOVED***` |
| `PORT` | `8080` |

### 5.5: Deploy

Pulsa **"Create Web Service"**. Render detectará el Dockerfile y desplegará automáticamente.

⏳ **Primer deploy:** 5-10 minutos (descarga Maven, dependencias, compila)

**URL generada:** `https://tfg-backend-xxxxx.onrender.com`

### 5.6: Verificar que el backend funciona

Abre en el navegador:

```
https://tfg-backend-xxxxx.onrender.com/api/rutas
```

Deberías ver una respuesta JSON (lista de rutas o `[]` si está vacía).

> ⚠️ **Cold Start:** Si el servicio lleva 15 minutos inactivo, la primera petición tarda ~30-60 segundos en responder (Render "despierta" el contenedor). Las siguientes peticiones son rápidas.

---

## **PASO 6: Actualizar Frontend con URL del Backend**

### 6.1: Crear/editar archivo `.env.production`

**Ruta:** `tfg_adventure/.env.production`

```env
VITE_API_URL=https://tfg-backend-xxxxx.onrender.com/api
```

(Reemplaza `xxxxx` con tu URL real de Render)

### 6.2: Verificar que `.env` local apunta a localhost

**Ruta:** `tfg_adventure/.env` (para desarrollo)

```env
VITE_API_URL=http://localhost:8080/api
```

> Vite usa `.env.production` automáticamente cuando ejecutas `npm run build`.

---

## **PASO 7: Build y Subir Frontend**

### 7.1: Build de producción

```bash
cd /Users/david/workspace/TFG_DAW/tfg_adventure

# Build de producción (usa .env.production automáticamente)
npm run build

# Verifica que se generó dist/
ls -la dist/
```

**Resultado esperado:**

```
dist/
├─ index.html
├─ assets/
│  ├─ index-xxxxx.js
│  └─ index-xxxxx.css
└─ ...
```

### 7.2: Crear `.htaccess` para React Router

React usa rutas del lado del cliente. Para que funcione en ProfesionalHosting (Apache), crea un `.htaccess`:

**Ruta:** `tfg_adventure/dist/.htaccess`

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### 7.3: Subir a ProfesionalHosting por FTP

#### Opción A: FileZilla (GUI — más fácil)

1. Descarga [FileZilla](https://filezilla-project.org) si no lo tienes
2. **File** → **Site Manager** → **New Site**:
   - **Host:** `ftp.cicloflorenciopintado.es`
   - **Port:** `21`
   - **User:** Tu usuario FTP
   - **Password:** Tu contraseña FTP
3. Conéctate
4. **Panel izquierdo:** Navega a `/Users/david/workspace/TFG_DAW/tfg_adventure/dist/`
5. **Panel derecho:** Navega a `public_html/`
6. Selecciona **TODO** en dist/ → Arrastra al panel derecho
7. **Incluye el `.htaccess`** (activa "mostrar archivos ocultos" en FileZilla: **Server** → **Force showing hidden files**)

#### Opción B: Terminal

```bash
# Si tienes lftp instalado (brew install lftp)
lftp -u tu_usuario,tu_password ftp.cicloflorenciopintado.es -e "
  mirror --reverse --verbose --delete \
    /Users/david/workspace/TFG_DAW/tfg_adventure/dist/ \
    /public_html/
  quit
"
```

---

## **PASO 8: Verificación Final**

### 8.1: Frontend

Abre: `https://davidr.cicloflorenciopintado.es`

- ✅ La página carga correctamente
- ✅ Se ve el diseño completo
- ✅ No hay errores en consola (F12 → Console)

### 8.2: Backend

Abre: `https://tfg-backend-xxxxx.onrender.com/api/rutas`

- ✅ Respuesta JSON (lista de rutas o `[]`)
- ✅ No hay error 500/401/403

### 8.3: Conexión completa Frontend ↔ Backend ↔ BD

1. En el frontend, intenta hacer **Login**
2. Abre F12 → **Network** tab
3. Verifica que la petición va a `https://tfg-backend-xxxxx.onrender.com/api/auth/login`
4. **200 OK** = ✅ ¡Todo funciona!

### 8.4: Base de datos

Verifica que los datos persisten desde el SQL Editor de TiDB Cloud:

```sql
USE rutas_app;
SELECT COUNT(*) FROM rutas;
SELECT COUNT(*) FROM usuario;
```

---

## **PASO 9: Troubleshooting**

### ❌ El backend tarda mucho en responder la primera vez

**Causa:** Cold Start de Render (servicio dormido tras 15 min de inactividad).

**Solución:** Usa [UptimeRobot](https://uptimerobot.com) (gratuito) para hacer ping cada 5 minutos:

1. Crea cuenta en UptimeRobot
2. **Add New Monitor** → **HTTP(s)**
3. URL: `https://tfg-backend-xxxxx.onrender.com/api/rutas`
4. Intervalo: **5 minutos**

Esto mantiene el backend "despierto" y evita cold starts.

### ❌ Error CORS al hacer peticiones desde el frontend

```
Access to XMLHttpRequest at 'https://tfg-backend-xxxxx.onrender.com/api/...'
from origin 'https://davidr.cicloflorenciopintado.es'
has been blocked by CORS policy
```

**Solución:** Edita `SecurityConfig.java` en el backend:

```java
http
    .cors(cors -> cors.configurationSource(request -> {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(
            "https://davidr.cicloflorenciopintado.es",  // Producción
            "http://localhost:5173"                       // Desarrollo local
        ));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);
        return config;
    }))
```

Luego redeploy:

```bash
cd /Users/david/workspace/TFG_DAW
git add .
git commit -m "Fix CORS for production"
git push
# Render redeploya automáticamente
```

### ❌ Error de conexión a la BD en Render

Verifica en los logs de Render (**Dashboard → Logs**):

- Si dice `Communications link failure` → El host/puerto de TiDB es incorrecto
- Si dice `Access denied` → Usuario/contraseña incorrectos
- Si dice `SSL` → Asegúrate de que la URL JDBC tiene `useSSL=true` y `sslMode=VERIFY_IDENTITY`

### ❌ Error "Unknown database" en TiDB

Has olvidado crear la BD `rutas_app`. Ve al SQL Editor de TiDB y ejecuta:

```sql
CREATE DATABASE rutas_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### ❌ El frontend no carga en ProfesionalHosting

- ✅ Verifica que TODO el contenido de `dist/` está en `public_html/` (no dentro de una subcarpeta)
- ✅ Verifica que `index.html` existe en `public_html/`
- ✅ Verifica que `.htaccess` está subido (necesario para React Router)
- ✅ Limpia caché del navegador (Ctrl+Shift+R)

### ❌ Las rutas de React dan 404 al refrescar

Falta el `.htaccess`. Vuelve al paso 7.2 y súbelo a `public_html/`.

### ❌ Se agotan los Request Units (RUs) de TiDB

Si tu app consume muchos RUs (50M/mes gratis), TiDB pausará las conexiones hasta el próximo mes. Para un TFG esto es **más que suficiente** — 50 millones de operaciones al mes es mucho.

### ❌ Diferencias MySQL vs TiDB

TiDB es 99% compatible con MySQL 8, pero hay diferencias menores:
- `AUTO_INCREMENT` funciona igual ✅
- `ENUM` funciona igual ✅
- `FOREIGN KEY` constraints son **parseados pero no enforced** ⚠️ (la integridad la gestiona tu app/Spring Boot)
- `TRIGGER` y `STORED PROCEDURE` tienen soporte limitado

Para un TFG con Spring Boot + JPA, estas diferencias **no afectan en absoluto**.

---

## 🎯 Checklist Final

Marca con ✅ cada paso completado:

- [ ] Cuenta en TiDB Cloud creada (tidbcloud.com)
- [ ] Cluster "Starter" creado (gratis)
- [ ] BD `rutas_app` creada en TiDB
- [ ] Datos importados (tablas, datos de prueba)
- [ ] `application-prod.properties` creado con variables de entorno
- [ ] Dockerfile actualizado con `-Dspring.profiles.active=prod`
- [ ] Cuenta en Render.com creada
- [ ] Repositorio GitHub pushado
- [ ] Web Service creado en Render (Docker, root: `tfg_backend`)
- [ ] Variables de entorno configuradas en Render (DB_HOST, DB_PORT, etc.)
- [ ] Backend desplegado y accesible (`/api/rutas` responde)
- [ ] `.env.production` creado con URL de Render
- [ ] Frontend compilado (`npm run build`)
- [ ] `.htaccess` creado en `dist/`
- [ ] `dist/` subido a ProfesionalHosting por FTP
- [ ] Frontend accesible en `https://davidr.cicloflorenciopintado.es`
- [ ] Login funciona (Frontend → Backend → BD)
- [ ] UptimeRobot configurado (opcional, para evitar cold starts)

---

## 📊 Resumen de Costes

| Componente | Servicio | Coste | ¿Trial o permanente? |
|-----------|---------|-------|----------------------|
| Frontend | ProfesionalHosting | **Ya pagado** (instituto) | Permanente |
| Backend | Render.com Free Tier | **$0/mes** | ✅ Permanente |
| Base de Datos | TiDB Cloud Starter | **$0/mes** | ✅ Permanente (5 GiB + 50M RUs) |
| Monitoreo | UptimeRobot Free | **$0/mes** | ✅ Permanente |
| **TOTAL** | | **$0/mes** | **Todo permanente ✅** |

---

## 📞 Contactos y Enlaces Útiles

| Servicio | URL | Para qué |
|----------|-----|----------|
| TiDB Cloud | [tidbcloud.com](https://tidbcloud.com) | Dashboard BD, SQL Editor, Import |
| Render | [dashboard.render.com](https://dashboard.render.com) | Deploy backend, logs, variables |
| ProfesionalHosting | Panel de control | Subir frontend por FTP |
| UptimeRobot | [uptimerobot.com](https://uptimerobot.com) | Evitar cold starts |

---

**Última actualización:** 20 de abril de 2026
**Versión:** 3.1 (TiDB Cloud Starter + Render — todo gratuito permanente, verificado)
