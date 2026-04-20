# MANUAL DEL PROGRAMADOR - AVENTURA

## Portal Web de Rutas de Senderismo

---

## ÍNDICE DE CONTENIDOS

1. [Introducción](#1-introducción)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Estructura de Archivos](#3-estructura-de-archivos)
4. [Base de Datos](#4-base-de-datos)
5. [Descripción de Archivos PHP](#5-descripción-de-archivos-php)
6. [Estilos CSS](#6-estilos-css)
7. [Gestión de Sesiones](#7-gestión-de-sesiones)

---

## 1. Introducción

### Descripción del Proyecto

Aventura es un portal web desarrollado en PHP para la gestión y exploración de rutas de senderismo. Permite a los usuarios registrarse, iniciar sesión, explorar rutas, guardar favoritos y crear nuevas rutas.

### Tecnologías Utilizadas

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| PHP | 8.x | Lenguaje de programación del lado del servidor |
| HTML5 | - | Estructura de las páginas web |
| CSS3 | - | Estilos y diseño visual |
| MySQL | 8.x | Sistema de gestión de base de datos |

---

## 2. Arquitectura del Sistema

### Patrón de Diseño

El proyecto utiliza una arquitectura basada en páginas PHP con separación de estilos CSS. Cada página gestiona su propia lógica de negocio y presentación.

### Flujo de Navegación

```
index.php
    │                                                        
    ├── login.php ──────────── register_page.php             
    │       │                        │                       
    │       └────────────────────────┘                       
    │                                                        
    ├── category_page.php ──── content_page.php              
    │                                                        
    ├── favorites_page.php (requiere sesión)                 
    │                                                        
    └── create_page.php (requiere sesión)                    
```

---

## 3. Estructura de Archivos

```
PortalWeb/
├── index.php                 # Página principal
├── login.php                 # Inicio de sesión
├── register_page.php         # Registro de usuarios
├── category_page.php         # Catálogo de rutas
├── content_page.php          # Detalle de ruta
├── favorites_page.php        # Rutas favoritas del usuario
├── create_page.php           # Formulario crear ruta
│
├── Includes/
│   └── styles.css            # Hoja de estilos principal
│
└── Img/
    ├── Icons/                # Iconos del sistema
    ├── Usuarios/             # Imágenes de perfil
    └── [imágenes de rutas]   # Fotografías de rutas
```

---

## 4. Base de Datos

### Modelo Entidad-Relación

*[Insertar imagen del modelo entidad-relación]*

### Modelo Relacional

*[Insertar imagen del modelo relacional]*

---

## 5. Descripción de Archivos PHP

### index.php

**Función**: Página principal del portal.

**Características**:
- Gestiona el cierre de sesión mediante parámetro GET `?cerrar_sesion=1`
- Muestra menú diferente según el estado de sesión del usuario
- Contiene las secciones de portada, información y tarjetas de senderos

**Variables de sesión utilizadas**:
- `$_SESSION['usuario']`: Nombre del usuario logueado

---

### login.php

**Función**: Formulario de inicio de sesión.

**Campos del formulario**:
- `usuario` (text): Nombre de usuario
- `contrasena` (password): Contraseña

**Validación**:
- Verifica credenciales contra la base de datos
- Si son correctas, guarda el usuario en `$_SESSION['usuario']`
- Redirige a `index.php` tras login exitoso

**Variables**:
- `$error`: Boolean que indica si hubo error en el login

---

### register_page.php

**Función**: Formulario de registro de nuevos usuarios.

**Campos del formulario**:
- `nombre_usuario` (text): Nombre de usuario único
- `email` (email): Correo electrónico
- `password` (password): Contraseña
- `confirmar_password` (password): Confirmación de contraseña
- `imagen` (file): Imagen de perfil (opcional)

**Validaciones**:
- Campos obligatorios no vacíos
- Contraseñas coincidentes
- Contraseña mínimo 4 caracteres
- Extensiones de imagen permitidas: jpg, jpeg, png, gif

**Gestión de imágenes**:
- Las imágenes se guardan en `Img/Usuarios/`
- Nombre del archivo: `nombreusuario_timestamp.extension`

---

### category_page.php

**Función**: Catálogo de rutas disponibles.

**Características**:
- Lista de tarjetas con información de cada ruta
- Caja de búsqueda para filtrar rutas
- Botón de favoritos en cada tarjeta

---

### content_page.php

**Función**: Detalle completo de una ruta.

**Información mostrada**:
- Nivel de dificultad
- Imagen principal
- Descripción del recorrido
- Recomendaciones de equipo
- Navegación entre rutas

---

### favorites_page.php

**Función**: Lista de rutas favoritas del usuario.

**Requisitos**: Usuario debe haber iniciado sesión.

**Características**:
- Misma estructura que category_page.php
- Muestra solo las rutas marcadas como favoritas

---

### create_page.php

**Función**: Formulario para crear nuevas rutas.

**Requisitos**: Usuario debe haber iniciado sesión.

**Campos del formulario**:
- `nombreRuta` (text): Nombre de la ruta
- `nivelRuta` (select): Nivel de dificultad (bajo, medio, alto)
- `distanciaRuta` (number): Distancia en kilómetros
- `duracionHoras` (number): Horas de duración
- `duracionMinutos` (number): Minutos de duración
- `ubicacionRuta` (text): Ubicación geográfica
- `descripcionRuta` (textarea): Descripción detallada
- `recomendacionesRuta` (textarea): Recomendaciones de equipo
- `imagenRuta` (file): Imagen de la ruta

---

## 6. Estilos CSS

### Organización del Archivo styles.css

El archivo CSS está organizado por secciones, identificadas por comentarios:

```css
/* INDEX.HTML - ESTILOS PRINCIPALES */
/* CONTENT_PAGE.HTML - PÁGINA DE DETALLE DE RUTA */
/* CREATE_PAGE.HTML - PÁGINA DE CREACIÓN DE RUTA */
/* CATEGORY_PAGE.HTML - PÁGINA DE CATEGORÍAS */
/* LOGIN.HTML - PÁGINA DE INICIO DE SESIÓN */
/* RESPONSIVE - TABLET Y MÓVIL */
```

### Convención de Nombres

Las clases CSS utilizan nomenclatura **camelCase** en español:
- `loginFormulario`
- `botonMarcador`
- `tarjetaRutaImagen`
- `menuDesplegable`

### Clases Principales

| Clase | Descripción |
|-------|-------------|
| `.contenedorLogoSuperior` | Logo en la parte superior |
| `.navbar` | Barra de navegación |
| `.menuUsuario` | Menú desplegable del usuario logueado |
| `.loginFormulario` | Formularios de login/registro |
| `.tarjetaRuta` | Tarjeta de ruta en el catálogo |
| `.formularioRuta` | Formulario de creación de ruta |

### Responsive Design

El diseño responsive se activa para pantallas menores a 850px:

```css
@media (max-width: 850px) {
    /* Estilos para tablet y móvil */
}
```

---

## 7. Gestión de Sesiones

### Inicio de Sesión

Todas las páginas PHP inician con:

```php
<?php
session_start();
?>
```

### Variables de Sesión

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `$_SESSION['usuario']` | string | Nombre del usuario logueado |

### Verificación de Sesión

Para verificar si un usuario está logueado:

```php
if (isset($_SESSION['usuario'])) {
    // Usuario logueado
} else {
    // Usuario no logueado
}
```

### Cierre de Sesión

El cierre de sesión se realiza en `index.php`:

```php
if (isset($_GET['cerrar_sesion'])) {
    session_destroy();
    header("Location: index.php");
    exit();
}
```

---

*Manual del Programador - Aventura v1.0*
