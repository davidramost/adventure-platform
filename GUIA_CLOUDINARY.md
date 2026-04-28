# 🖤 Guía: Implementar Foto de Perfil con Cloudinary

## 1️⃣ Configurar Cloudinary (5 minutos)

### Paso 1: Crear cuenta
1. Ve a https://cloudinary.com
2. Regístrate con tu email
3. En el dashboard, busca **"Cloud Name"** (algo como: `dqg0x8k4j`)
4. Cópialo

### Paso 2: Crear Upload Preset (sin firmar)
1. En Cloudinary, ve a **Settings → Upload** (engranaje arriba)
2. En la sección **Upload presets**, haz clic en **Add upload preset**
3. Ponle nombre: `tfg_adventure` (o lo que quieras)
4. En **Signing Mode**, selecciona **Unsigned** (así no necesitas backend)
5. En **Folder**, escribe: `tfg_adventure/avatars`
6. Haz clic en **Save**
7. Copia el nombre del preset que acabas de crear

### Paso 3: Variables de entorno
En `tfg_adventure/.env` (crea el archivo si no existe):

```env
VITE_API_URL=http://localhost:8080/api
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name_aqui
VITE_CLOUDINARY_UPLOAD_PRESET=tfg_adventure
```

Sustituye `tu_cloud_name_aqui` por el Cloud Name que copiaste en Paso 1.

---

## 2️⃣ Frontend: Ya está hecho ✅

- ✅ `src/services/cloudinaryService.ts` → Upload automático a Cloudinary
- ✅ `src/services/usuarioService.ts` → Endpoints para perfil
- ✅ `src/pages/ProfilePage.tsx` → Pantalla de perfil completa
- ✅ `src/components/Header.tsx` → Avatar visible en navbar
- ✅ Tipo `Usuario` con campo `imagen`

**Ya puedes subir fotos al hacer login/registro**, Cloudinary las guarda automáticamente.

---

## 3️⃣ Backend: Endpoints necesarios (Pep, esto es para ti 👉)

### ¿Qué necesita hacer el backend?

Los siguientes endpoints **ya devuelven usuario con imagen desde la BD**:
- `POST /api/auth/login` → Devuelve usuario con imagen
- `POST /api/auth/register` → Devuelve usuario con imagen

**Endpoints NUEVOS que faltan:**

```java
// GET /api/usuarios/me
// Devuelve: { id_usuario, nombre_usuario, email, imagen, rol }
// Protegido: JWT requerido

// PUT /api/usuarios/me
// Request: { nombre_usuario?: string }
// Devuelve: Usuario actualizado
// Protegido: JWT requerido

// POST /api/usuarios/me/avatar
// Request: { imagen: "https://..." }
// Devuelve: { imagen: "https://..." }
// Protegido: JWT requerido
```

### Request/Response esperados:

```json
// POST /api/usuarios/me/avatar
{
  "imagen": "https://res.cloudinary.com/dqg0x8k4j/image/upload/v1234567890/tfg_adventure/avatars/archivo.jpg"
}

// Response 200
{
  "imagen": "https://res.cloudinary.com/dqg0x8k4j/image/upload/v1234567890/tfg_adventure/avatars/archivo.jpg"
}
```

---

## 4️⃣ Flujo completo

1. Usuario sube imagen en ProfilePage
2. Frontend envía a Cloudinary (sin pasar por backend)
3. Cloudinary devuelve URL `https://...`
4. Frontend envía URL al backend (`POST /api/usuarios/me/avatar`)
5. Backend guarda URL en BD (tabla `usuario`, columna `imagen`)
6. Frontend actualiza `usuario.imagen` en localStorage
7. Header muestra la nueva foto

---

## 5️⃣ ¿Qué pasa si NO subes foto?

Se usa un avatar placeholder aleatorio de **DiceBear**:
```
https://api.dicebear.com/7.x/avataaars/svg?seed=RANDOM_SEED&scale=80
```

Siempre hay imagen, nunca usuario sin foto. ¡Perfecto!

---

## 6️⃣ Testing en desarrollo

```bash
# Terminal 1: Frontend
cd tfg_adventure
npm run dev
# Abre http://localhost:5173

# Terminal 2: Backend (si está corriendo)
# Debería estar en http://localhost:8080
```

Acciones para probar:
1. Haz login
2. Ve a "Mi Perfil" (click en avatar en navbar)
3. Sube una foto (click en avatar en la pantalla de perfil)
4. Edita nombre de usuario
5. Gestiona favoritos

---

## 🚨 Errores comunes

| Error | Solución |
|-------|----------|
| "Error al subir foto" | Verifica que `VITE_CLOUDINARY_CLOUD_NAME` y `VITE_CLOUDINARY_UPLOAD_PRESET` en `.env` son correctos |
| Avatar no se carga | El backend aún no devuelve `imagen` en login/register |
| "No estás loggeado" | Asegúrate de estar dentro de `<AuthProvider>` en `main.tsx` |

---

## ✨ Resultado final

- ✅ Usuario ve foto en navbar (indica que está loggeado)
- ✅ Pantalla de perfil completa (foto, nombre, email, favoritos)
- ✅ Upload drag-drop de foto
- ✅ Editar nombre de usuario
- ✅ Gestionar favoritos desde perfil
- ✅ Foto por defecto si no hay imagen
