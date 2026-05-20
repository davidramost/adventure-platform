<?php
declare(strict_types=1);

// ============================================================
// CONFIGURACIÓN DE CORREO — copia este archivo a mail-config.php
// y rellena tus valores reales. NUNCA subas mail-config.php a Git.
// ============================================================

// Clave secreta compartida con el backend Spring Boot
define('MAIL_API_KEY', 'CAMBIA_ESTO_POR_UNA_CLAVE_SECRETA_LARGA');

// SMTP de tu hosting (datos en cPanel → Información de la conexión)
define('SMTP_HOST',       'mail.tudominio.es');   // ej: mail.cicloflorenciopintado.es
define('SMTP_USER',       'noreply@tudominio.es'); // cuenta de email creada en cPanel
define('SMTP_PASS',       'tu_contraseña_aqui');
define('SMTP_PORT',        587);                   // 587 (STARTTLS) o 465 (SSL)
define('SMTP_ENCRYPTION', 'tls');                  // 'tls' para 587, 'ssl' para 465

// Remitente que verá el usuario
define('MAIL_FROM',      'noreply@tudominio.es');
define('MAIL_FROM_NAME', 'TFG Adventure');
