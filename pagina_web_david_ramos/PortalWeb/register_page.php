<?php
session_start();

$error = "";
$exito = false;
$nombre_usuario = "";
$email = "";

$imagenes_info = $_SESSION['register_imagenes_info'] ?? [];
$imagenes_paths = $_SESSION['register_imagenes_paths'] ?? [];

function formatearTamano($bytes)
{
    if ($bytes >= 1048576) {
        return number_format($bytes / 1048576, 2) . ' MB';
    } elseif ($bytes >= 1024) {
        return number_format($bytes / 1024, 2) . ' KB';
    }
    return $bytes . ' Bytes';
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['accion']) && $_POST['accion'] === 'examinar') {
        if (!empty($imagenes_paths)) {
            foreach ($imagenes_paths as $ruta_antigua) {
                if (file_exists($ruta_antigua)) {
                    unlink($ruta_antigua);
                }
            }
        }
        $imagenes_info = [];
        $imagenes_paths = [];
        $_SESSION['register_imagenes_info'] = [];
        $_SESSION['register_imagenes_paths'] = [];

        $nombre_usuario = trim($_POST['nombre_usuario'] ?? '');
        $email = trim($_POST['email'] ?? '');

        if (isset($_FILES['imagen']) && !empty($_FILES['imagen']['name'])) {
            $archivo = $_FILES['imagen'];

            if ($archivo['error'] === UPLOAD_ERR_OK) {
                $nombre_archivo = basename($archivo['name']);
                $tamano_archivo = $archivo['size'];
                $max_tamano = 3 * 1024 * 1024;
                $extensiones_permitidas = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
                $extension = strtolower(pathinfo($nombre_archivo, PATHINFO_EXTENSION));

                if ($tamano_archivo > $max_tamano) {
                    $error = "La imagen de perfil no debe superar los 3MB.";
                } elseif (!in_array($extension, $extensiones_permitidas)) {
                    $error = "Formato de imagen no válido. Solo JPG, JPEG, PNG, GIF o WEBP.";
                } else {
                    $directorio_destino = 'Img/Usuarios/Profile/';
                    if (!is_dir($directorio_destino)) {
                        mkdir($directorio_destino, 0755, true);
                    }

                    $nombre_archivo_seguro = basename($nombre_archivo);
                    $nuevo_nombre = uniqid() . "_" . $nombre_archivo_seguro;
                    $ruta_completa = $directorio_destino . $nuevo_nombre;

                    if (move_uploaded_file($archivo['tmp_name'], $ruta_completa)) {
                        $imagenes_paths[] = $ruta_completa;
                        $imagenes_info[] = [
                            'nombre' => $nombre_archivo,
                            'tamano' => formatearTamano($tamano_archivo),
                            'tamano_bytes' => $tamano_archivo,
                            'ruta' => $ruta_completa
                        ];
                        $_SESSION['register_imagenes_info'] = $imagenes_info;
                        $_SESSION['register_imagenes_paths'] = $imagenes_paths;
                    } else {
                        $error = "Error al subir la imagen de perfil.";
                    }
                }
            } else {
                $error = "Error en la subida del archivo.";
            }
        }
    }
    elseif (isset($_POST['accion']) && $_POST['accion'] === 'registrarse') {

        $nombre_usuario = trim($_POST['nombre_usuario']);
        $email = trim($_POST['email']);
        $user_password = $_POST['password'];
        $confirmar_password = $_POST['confirmar_password'];

        if (empty($nombre_usuario) || empty($email) || empty($user_password) || empty($confirmar_password)) {
            $error = "Todos los campos son obligatorios.";
        } elseif (strlen($nombre_usuario) < 3 || strlen($nombre_usuario) > 20) {
            $error = "El nombre de usuario debe tener entre 3 y 20 caracteres.";
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $error = "El formato del correo electrónico no es válido.";
        } elseif ($user_password !== $confirmar_password) {
            $error = "Las contraseñas no coinciden.";
        } else {
            if (strlen($user_password) < 8 || strlen($user_password) > 20) {
                $error = "La contraseña debe tener entre 8 y 20 caracteres.";
            } elseif (!preg_match('/[A-Z]/', $user_password)) {
                $error = "La contraseña debe contener al menos una letra mayúscula.";
            } elseif (!preg_match('/[a-z]/', $user_password)) {
                $error = "La contraseña debe contener al menos una letra minúscula.";
            } elseif (!preg_match('/[0-9]/', $user_password)) {
                $error = "La contraseña debe contener al menos un número.";
            } elseif (!preg_match('/[\W_]/', $user_password)) {
                $error = "La contraseña debe contener al menos un carácter especial (guion, arroba, etc.).";
            }
        }

        if (empty($error)) {
            require_once 'Includes/db.php';

            try {
                $stmt = $pdo->prepare("SELECT id_usuario FROM usuario WHERE nombre_usuario = ? OR email = ?");
                $stmt->execute([$nombre_usuario, $email]);

                if ($stmt->rowCount() > 0) {
                    $error = "El nombre de usuario o el correo electrónico ya están registrados.";
                } else {
                    $imagen_ruta = null;

                    if (!empty($_SESSION['register_imagenes_paths'])) {
                        $imagen_ruta = $_SESSION['register_imagenes_paths'][0];
                    }
                    elseif (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
                        $archivo = $_FILES['imagen'];
                        $nombre_archivo = $archivo['name'];
                        $tamano_archivo = $archivo['size'];
                        $tmp_archivo = $archivo['tmp_name'];

                        $max_tamano = 3 * 1024 * 1024;
                        $extensiones_permitidas = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
                        $extension = strtolower(pathinfo($nombre_archivo, PATHINFO_EXTENSION));

                        if ($tamano_archivo > $max_tamano) {
                            $error = "La imagen de perfil no debe superar los 3MB.";
                        } elseif (!in_array($extension, $extensiones_permitidas)) {
                            $error = "Formato de imagen no válido. Solo se permiten JPG, JPEG, PNG, GIF o WEBP.";
                        } else {
                            $directorio_destino = 'Img/Usuarios/Profile/';
                            if (!is_dir($directorio_destino)) {
                                mkdir($directorio_destino, 0755, true);
                            }

                            $nombre_archivo_seguro = basename($nombre_archivo);
                            $nuevo_nombre = uniqid() . "_" . $nombre_archivo_seguro;
                            $ruta_completa = $directorio_destino . $nuevo_nombre;

                            if (move_uploaded_file($tmp_archivo, $ruta_completa)) {
                                $imagen_ruta = $ruta_completa;
                            } else {
                                $error = "Error al subir la imagen de perfil.";
                            }
                        }
                    }
                }

                if (empty($error)) {
                    $password_hash = password_hash($user_password, PASSWORD_DEFAULT);

                    $sql = "INSERT INTO usuario (nombre_usuario, password, email, imagen) VALUES (?, ?, ?, ?)";
                    $stmtInsert = $pdo->prepare($sql);

                    if ($stmtInsert->execute([$nombre_usuario, $password_hash, $email, $imagen_ruta])) {
                        $id_usuario = $pdo->lastInsertId();

                        unset($_SESSION['register_imagenes_info']);
                        unset($_SESSION['register_imagenes_paths']);

                        $_SESSION['usuario'] = $nombre_usuario;
                        $_SESSION['id_usuario'] = $id_usuario;
                        $_SESSION['perfil_imagen'] = $imagen_ruta;
                        $_SESSION['rol'] = 'usuario';

                        header("Location: index.php");
                        exit();
                    } else {
                        $error = "Error al registrar el usuario en la base de datos.";
                    }
                }
            } catch (PDOException $e) {
                $error = "Error de conexión: " . $e->getMessage();
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <link rel="stylesheet" href="Includes/styles.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registro - Aventura</title>
</head>

<body id="top">

    <header class="header-general">
        <?php include 'Includes/header.php'; ?>
    </header>

    <main class="loginPrincipal">
        <div class="loginContenedor">
            <h1>Crear Cuenta</h1>

            <?php if ($error) { ?>
                <p class="mensajeError"><?php echo $error; ?></p>
            <?php } ?>

            <form class="loginFormulario" action="<?php echo $_SERVER["PHP_SELF"]; ?>" method="POST" enctype="multipart/form-data">
                <div class="loginCampo">
                    <label for="nombre_usuario">Nombre de usuario</label>
                    <div class="loginInputGrupo">
                        <img src="Img/Icons/user.png" alt="Usuario" class="iconoInput">
                        <input type="text" id="nombre_usuario" name="nombre_usuario" placeholder="Tu nombre de usuario"
                            value="<?php if (isset($nombre_usuario)) echo $nombre_usuario; ?>" required>
                    </div>
                </div>

                <div class="loginCampo">
                    <label for="email">Email</label>
                    <div class="loginInputGrupo">
                        <img src="Img/Icons/mail.png" alt="Email" class="iconoInput">
                        <input type="email" id="email" name="email" placeholder="Tu correo electrónico"
                            value="<?php if (isset($email)) echo $email; ?>" required>
                    </div>
                </div>

                <div class="loginCampo">
                    <label for="password">Contraseña</label>
                    <div class="loginInputGrupo">
                        <img src="Img/Icons/lock.png" alt="Contraseña" class="iconoInput">
                        <input type="password" id="password" name="password" placeholder="Tu contraseña" required>
                    </div>
                </div>

                <div class="loginCampo">
                    <label for="confirmar_password">Confirmar contraseña</label>
                    <div class="loginInputGrupo">
                        <img src="Img/Icons/lock.png" alt="Confirmar" class="iconoInput">
                        <input type="password" id="confirmar_password" name="confirmar_password" placeholder="Repite tu contraseña" required>
                    </div>
                </div>

                <div class="loginCampo">
                    <label for="imagen">Imagen de perfil (Máx. 3MB)</label>
                    <div class="formularioImagenExaminar">
                        <input type="hidden" name="MAX_FILE_SIZE" value="3145728">
                        <input type="file" id="imagen" name="imagen" accept="image/jpeg,image/png,image/gif,image/webp">
                        <p class="examinarInfo">Formatos: JPG, PNG, GIF, WEBP — Máx. 1 imagen de 3MB</p>
                        
                        <?php if (!empty($imagenes_info)): ?>
                            <div class="imagenesResumen">
                                <p class="imagenesContador">Imagen subida: <strong>1</strong></p>
                                <table class="tablaImagenes">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Tamaño</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($imagenes_info as $img): ?>
                                            <tr>
                                                <td><?php echo htmlspecialchars($img['nombre']); ?></td>
                                                <td><?php echo $img['tamano']; ?></td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>

                <button type="submit" name="accion" value="registrarse" class="loginBoton">Registrarse <img src="Img/Icons/arrow_right_black.png" alt="Registrar" class="iconoBotonLogin"></button>
            </form>

            <div class="loginEnlaces">
                <a href="login.php">¿Ya tienes cuenta? Inicia sesión</a>
            </div>

            <div class="loginEnlaces">
                <a href="index.php"><img src="Img/Icons/arrow_left.png" alt="Volver" class="iconoVolver"> Volver al inicio</a>
            </div>
        </div>
    </main>

    <footer>
        <?php include 'Includes/footer.php'; ?>
    </footer>
</body>

</html>