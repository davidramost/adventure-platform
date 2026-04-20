<nav class="navbar">
    <a href="index.php" class="logo-desktop">
        <img src="Img/the_logo.png" width="80em" alt="Inicio">
    </a>
    <div class="iconoMenu">
        <img src="Img/Icons/lineas.png" width="70em" alt="Menú">
    </div>
    <ul class="enlacesNav">
        <li><a href="index.php">INICIO</a></li>
        <li><a href="gallery_page.php">GALERÍA</a></li>
        <li><a href="category_page.php">SENDEROS</a></li>
    </ul>
    <div class="login">
        <?php if (isset($_SESSION['usuario'])) { ?>
            <div class="menuUsuario">
                <?php if (!empty($_SESSION['perfil_imagen'])) { ?>
                    <img src="<?php echo $_SESSION['perfil_imagen']; ?>" alt="Perfil" class="fotoPerfilHeader" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; margin-right: 10px; vertical-align: middle;">
                <?php } ?>
                <span class="nombreUsuario"><?php echo $_SESSION['usuario']; ?></span>
                <div class="menuDesplegable">
                    <a href="favorites_page.php">Favoritos</a>
                    <a href="create_page.php">Crear ruta</a>
                    <a href="index.php?cerrar_sesion=1">Cerrar sesión</a>
                </div>
            </div>
        <?php } else { ?>
            <a href="login.php">Iniciar sesión</a>
        <?php } ?>
    </div>
</nav>

<script>
    document.querySelector('.iconoMenu').addEventListener('click', function() {
        document.querySelector('.enlacesNav').classList.toggle('mostrar-menu');
    });
</script>