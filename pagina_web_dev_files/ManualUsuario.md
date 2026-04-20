# MANUAL DE USUARIO - AVENTURA

## Portal Web de Rutas de Senderismo

---

## ÍNDICE DE CONTENIDOS

1. [Página Principal (Index)](#1-página-principal-index)
2. [Inicio de Sesión](#2-inicio-de-sesión)
3. [Registro de Usuario](#3-registro-de-usuario)
4. [Explorar Rutas](#4-explorar-rutas)
5. [Detalle de Ruta](#5-detalle-de-ruta)
6. [Mis Favoritos](#6-mis-favoritos)
7. [Crear Nueva Ruta](#7-crear-nueva-ruta)

---

## 1. Página Principal (Index)

### Navegación Principal

Al acceder al portal web de Aventura, el usuario encontrará la página principal con los siguientes elementos:

- **Logo superior**: Permite volver a la página principal desde cualquier parte del sitio.
- **Menú de navegación**: Contiene los enlaces a INICIO, GALERÍA y SENDEROS.
- **Botón Iniciar sesión / Menú de usuario**: 
  - Si no has iniciado sesión, aparece el botón "Iniciar sesión".
  - Si has iniciado sesión, aparece tu nombre de usuario con un menú desplegable que contiene: Favoritos, Crear ruta y Cerrar sesión.
- **Sección de portada**: Muestra el título "AVENTURA" con iconos de actividades (senderismo, camping, ciclismo, esquí) y un botón "Descubre más" que lleva al catálogo de rutas.
- **Sección informativa**: "Aventura en la naturaleza" con un enlace "Ver Más" que muestra el detalle de una ruta.
- **Tarjetas de senderos**: Tres tarjetas (El Despertar, La Mañana, La Cima) clasificadas por nivel de dificultad.
- **Pie de página**: Contiene información de contacto, redes sociales y enlaces legales.

*[Insertar captura de pantalla de index.php]*

---

## 2. Inicio de Sesión

### Acceso a la Cuenta

Para iniciar sesión en el portal:

1. Hacer clic en el botón **"Iniciar sesión"** del menú superior.
2. Se mostrará el formulario de login con los siguientes campos:
   - **Usuario**: Introduce tu nombre de usuario registrado.
   - **Contraseña**: Introduce tu contraseña.
3. Pulsar el botón **"Entrar"** para acceder a tu cuenta.

Si no tienes una cuenta, puedes hacer clic en el enlace **"¿No tienes cuenta? Regístrate"** para acceder al formulario de registro.

El enlace **"Volver al inicio"** te llevará de vuelta a la página principal.

*[Insertar captura de pantalla de login.php]*

---

## 3. Registro de Usuario

### Crear una Cuenta Nueva

Para registrarse como nuevo usuario:

1. Desde la página de login, hacer clic en **"¿No tienes cuenta? Regístrate"**.
2. Rellenar el formulario con los siguientes campos obligatorios:
   - **Nombre de usuario**: Elige un nombre único para tu cuenta.
   - **Email**: Introduce tu correo electrónico válido.
   - **Contraseña**: Crea una contraseña segura (mínimo 4 caracteres).
   - **Confirmar contraseña**: Repite la contraseña para verificar.
   - **Imagen de perfil** (opcional): Puedes subir una foto de perfil haciendo clic en "Seleccionar imagen".
3. Pulsar el botón **"Registrarse"** para crear la cuenta.

Una vez registrado, iniciarás sesión automáticamente y serás redirigido a la página principal.

*[Insertar captura de pantalla de register_page.php]*

---

## 4. Explorar Rutas

### Catálogo de Rutas Disponibles

La página de rutas muestra todas las rutas de senderismo disponibles:

- **Barra de herramientas**: Incluye el título "Nuestra selección de rutas" y una caja de búsqueda para filtrar rutas.
- **Lista de rutas**: Cada tarjeta de ruta muestra:
  - Imagen de la ruta
  - Nivel de dificultad (Bajo, Medio, Alto)
  - Ubicación geográfica
  - Valoración con estrellas
  - Duración estimada
  - Distancia en kilómetros
  - Icono de mapa para ver la ubicación
  - Botón de favoritos para guardar la ruta

Para ver más rutas, pulsar el botón con la flecha hacia abajo en la parte inferior.

El logo del pie de página permite volver al inicio de la página actual.

*[Insertar captura de pantalla de category_page.php]*

---

## 5. Detalle de Ruta

### Información Completa de una Ruta

Al seleccionar una ruta, se muestra la página de detalle con:

- **Título del nivel**: Indica la dificultad de la ruta (ej: "NIVEL BAJO").
- **Imagen principal**: Fotografía representativa de la ruta.
- **Descripción**: Texto detallado sobre el recorrido, características y experiencia que ofrece.
- **Recomendaciones**: Consejos sobre ropa y equipo necesario para realizar la ruta de forma segura.
- **Navegación**: Flechas de paginación para ver otras rutas.

El logo superior permite volver a la página principal en cualquier momento.

*[Insertar captura de pantalla de content_page.php]*

---

## 6. Mis Favoritos

### Rutas Guardadas

Para acceder a tus rutas favoritas:

1. Inicia sesión en tu cuenta.
2. Haz clic en tu nombre de usuario en la esquina superior derecha.
3. Selecciona la opción **"Favoritos"** del menú desplegable.

La página de favoritos muestra:

- **Barra de herramientas**: Título "Mis rutas favoritas" y caja de búsqueda.
- **Lista de rutas guardadas**: Las rutas que has marcado como favoritas, con la misma información que en el catálogo general.
- **Botón de favorito**: Permite quitar rutas de tu lista de favoritos.

*[Insertar captura de pantalla de favorites_page.php]*

---

## 7. Crear Nueva Ruta

### Añadir una Ruta al Catálogo

Para crear una nueva ruta (requiere iniciar sesión):

1. Haz clic en tu nombre de usuario en la esquina superior derecha.
2. Selecciona la opción **"Crear ruta"** del menú desplegable.
3. Rellena el formulario con los siguientes campos:
   - **Nombre de la ruta**: Nombre identificativo de la ruta.
   - **Nivel de dificultad**: Selecciona entre Bajo, Medio o Alto.
   - **Distancia (km)**: Distancia total del recorrido.
   - **Duración estimada**: Tiempo aproximado en horas y minutos.
   - **Ubicación**: Lugar geográfico de la ruta.
   - **Descripción de la ruta**: Detalles sobre el recorrido y puntos de interés.
   - **Recomendaciones**: Consejos sobre ropa y equipo necesario.
   - **Imagen de la ruta**: Sube una fotografía representativa.
4. Pulsar **"Guardar Ruta"** para añadir la ruta al catálogo.
5. Pulsar **"Cancelar"** para volver a la página de rutas sin guardar.

*[Insertar captura de pantalla de create_page.php]*

---

## Requisitos Técnicos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a Internet

---

*Manual de Usuario - Aventura v1.0*
