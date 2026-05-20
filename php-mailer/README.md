# PHP Mailer — TFG Adventure

Script PHP con PHPMailer para enviar emails desde el backend Spring Boot a través del hosting compartido.

## Estructura

```
php-mailer/
├── send-email.php          → endpoint que recibe las peticiones del backend
├── mail-config.example.php → plantilla de configuración (copia a mail-config.php)
├── .htaccess               → protege mail-config.php de acceso público
├── vendor/                 → PHPMailer (instalar con Composer)
└── README.md
```

## Instalación en el hosting

### 1. Instalar PHPMailer

Desde tu PC con Composer instalado:

```bash
cd php-mailer
composer require phpmailer/phpmailer
```

Esto crea la carpeta `vendor/`. Súbela al hosting junto con los demás archivos.

Si no tienes Composer, conéctate por SSH al hosting (si lo permite) y ejecuta el mismo comando.

### 2. Crear el archivo de configuración

```bash
cp mail-config.example.php mail-config.php
```

Edita `mail-config.php` con los datos reales:

- **MAIL_API_KEY**: una clave secreta larga (ej: genera con `openssl rand -hex 32`)
- **SMTP_HOST**: míralo en cPanel → Información de la conexión (ej: `mail.cicloflorenciopintado.es`)
- **SMTP_USER / SMTP_PASS**: la cuenta de email que crees en cPanel → Cuentas de correo
- **SMTP_PORT**: 587 para STARTTLS (recomendado) o 465 para SSL

### 3. Subir al hosting vía FTP

Sube el contenido de esta carpeta a `httpdocs/api/` en tu hosting.

**Estructura final en el hosting:**

```
httpdocs/
├── index.html              → React build
├── assets/                 → React assets
└── api/
    ├── send-email.php
    ├── mail-config.php     → solo en el servidor, NO en Git
    ├── .htaccess
    └── vendor/             → PHPMailer
```

### 4. Verificar que .htaccess funciona

Accede a `https://davidr.cicloflorenciopintado.es/api/mail-config.php` desde el navegador.
Debe devolver **403 Forbidden**, no el contenido del archivo.

### 5. Configurar Spring Boot

En las variables de entorno de Render (o en `.env` local):

```
PHP_MAILER_URL=https://davidr.cicloflorenciopintado.es/api/send-email.php
PHP_MAILER_API_KEY=la_misma_clave_que_pusiste_en_mail-config.php
```

### 6. Excluir mail-config.php de Git

Ya está en `.gitignore` del proyecto. Confirma que no se sube nunca.

## Prueba manual

```bash
curl -X POST https://davidr.cicloflorenciopintado.es/api/send-email.php \
  -H "Content-Type: application/json" \
  -H "X-Api-Key: TU_CLAVE_AQUI" \
  -d '{"to":"test@example.com","subject":"Test","body":"Esto es una prueba"}'
```

Respuesta correcta: `{"success":true}`

## React → .htaccess del frontend

Si tu React SPA tiene un `.htaccess` que redirige todo a `index.html`, asegúrate de excluir la carpeta `api/`:

```apache
RewriteEngine On
RewriteCond %{REQUEST_URI} !^/api/
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```
