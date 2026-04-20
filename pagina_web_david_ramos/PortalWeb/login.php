<?php
session_start();

$error = false;
$usuario_value = "";

if (isset($_COOKIE['usuario_recordado'])) {
    $usuario_value = $_COOKIE['usuario_recordado'];
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario_login = trim($_POST['usuario']);
    $usuario_value = $usuario_login;
    $contrasena = trim($_POST['contrasena']);

    require_once 'Includes/db.php';

    $stmt = $pdo->prepare("SELECT id_usuario, nombre_usuario, password, imagen FROM usuario WHERE nombre_usuario = ?");
    $stmt->execute([$usuario_login]);

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        $password_ok = password_verify($contrasena, $row['password']);
        if (!$password_ok && $row['password'] === $contrasena) {
            $password_ok = true;
        }

        if ($password_ok) {
            $_SESSION['usuario'] = $row['nombre_usuario'];
            $_SESSION['id_usuario'] = $row['id_usuario'];
            $_SESSION['perfil_imagen'] = $row['imagen'];

            if (strtolower($row['nombre_usuario']) === 'admin') {
                $_SESSION['rol'] = 'admin';
            } else {
                $_SESSION['rol'] = 'usuario';
            }

            if (isset($_POST['recordar'])) {
                setcookie('usuario_recordado', $row['nombre_usuario'], time() + (86400 * 30), "/");
            } else {
                if (isset($_COOKIE['usuario_recordado'])) {
                    setcookie('usuario_recordado', "", time() - 3600, "/");
                }
            }

            header("Location: index.php");
            exit();
        } else {
            $error = "Contraseña incorrecta.";
        }
    } else {
        $error = "Usuario no encontrado (Verifique el nombre de usuario).";
    }
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <link rel="stylesheet" href="Includes/styles.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión - Aventura</title>
</head>

<body id="top">

    <header class="header-general">
        <?php include 'Includes/header.php'; ?>
    </header>

    <main class="loginPrincipal">
        <div class="loginContenedor">
            <h1>Iniciar Sesión</h1>

            <?php if ($error) { ?>
                <p class="mensajeError"><?php echo $error; ?></p>
            <?php } ?>

            <form class="loginFormulario" action="<?php echo $_SERVER["PHP_SELF"]; ?>" method="POST">
                <div class="loginCampo">
                    <label for="usuario">Usuario</label>
                    <div class="loginInputGrupo">
                        <img src="Img/Icons/user.png" alt="Usuario" class="iconoInput">
                        <input type="text" id="usuario" name="usuario" placeholder="Tu nombre de usuario"
                            value="<?php echo htmlspecialchars($usuario_value); ?>" required>
                    </div>
                </div>

                <div class="loginCampo">
                    <label for="contrasena">Contraseña</label>
                    <div class="loginInputGrupo">
                        <img src="Img/Icons/lock.png" alt="Contraseña" class="iconoInput">
                        <input type="password" id="contrasena" name="contrasena" placeholder="Tu contraseña" required>
                    </div>
                </div>

                <div class="loginCampo" style="display: flex; flex-direction: row; align-items: center; gap: 10px;">
                    <input type="checkbox" id="recordar" name="recordar" style="width: auto; margin-top: 0;">
                    <label for="recordar" style="margin-bottom: 0; cursor: pointer;">Recordar mi usuario</label>
                </div>

                <button type="submit" class="loginBoton">Entrar <img src="Img/Icons/arrow_right_black.png" alt="Entrar"
                        class="iconoBotonLogin"></button>
            </form>

            <div class="loginEnlaces">
                <a href="register_page.php">¿No tienes cuenta? Regístrate</a>
            </div>

            <div class="loginEnlaces">
                <a href="index.php"><img src="Img/Icons/arrow_left.png" alt="Volver" class="iconoVolver"> Volver al
                    inicio</a>
            </div>
        </div>
    </main>

    <footer>
        <?php include 'Includes/footer.php'; ?>
    </footer>
</body>

</html>