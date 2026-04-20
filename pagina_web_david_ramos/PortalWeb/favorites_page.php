<?php
session_start();

if (!isset($_SESSION['id_usuario'])) {
    header("Location: login.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <link rel="stylesheet" href="Includes/styles.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mis rutas favoritas - Aventura</title>
    <script src="./libraries/jquery/jquery.js"></script>
    <script src="./js/favorites.js"></script>
</head>

<body id="top">

    <header class="header-general">
        <?php include 'Includes/header.php'; ?>
    </header>

    <main class="categoriaPrincipal">
        <div class="categoriaToolbar">
            <h1>Mis rutas favoritas</h1>
            <div class="cajaBusqueda">
            </div>
        </div>

        <section class="listaRutas">
            <?php
            require_once 'Includes/db.php';
            $id_usuario = $_SESSION['id_usuario'];

            try {
                $sql = "SELECT r.*, u.nombre as nombre_ubicacion,
                        COALESCE((SELECT AVG(puntuacion) FROM resena WHERE id_ruta = r.id_ruta), 0) as media_puntuacion
                        FROM ruta r 
                        JOIN ubicacion u ON r.id_ubicacion = u.id_ubicacion
                        JOIN favorito f ON r.id_ruta = f.id_ruta
                        WHERE f.id_usuario = :id_usuario";

                $stmt = $pdo->prepare($sql);
                $stmt->execute([':id_usuario' => $id_usuario]);
                $favoritos = $stmt->fetchAll(PDO::FETCH_ASSOC);

                if (count($favoritos) > 0) {
                    foreach ($favoritos as $ruta) {
                        $ruta['es_favorito'] = 1; 
            ?>
                        <article class="tarjetaRuta">
                            <a href="content_page.php?id=<?php echo $ruta['id_ruta']; ?>" class="tarjetaRutaEnlace">
                                <div class="tarjetaRutaImagen">
                                    <?php if (!empty($ruta['imagen_url'])): ?>
                                        <img src="<?php echo htmlspecialchars($ruta['imagen_url']); ?>" alt="Imagen ruta">
                                    <?php else: ?>
                                        <div class="sinFoto"><img src="Img/Icons/sin-imagen.png" alt="Sin foto"></div>
                                    <?php endif; ?>
                                </div>
                                <div class="tarjetaRutaInfo">
                                    <h2><?php echo htmlspecialchars($ruta['nombre_ruta']); ?></h2>
                                    <p class="tarjetaRutaUbicacion"><?php echo htmlspecialchars($ruta['nombre_ubicacion']); ?></p>
                                    <div class="tarjetaRutaEstadisticas">
                                        <span><img src="Img/Icons/star.png" alt="Estrella" class="iconoEstrella"> <?php echo number_format($ruta['media_puntuacion'], 1); ?></span>
                                        <span>• <?php echo htmlspecialchars($ruta['duracion_estimada']); ?></span>
                                        <span>• <?php echo htmlspecialchars($ruta['distancia_km']); ?>km</span>
                                    </div>
                                </div>
                            </a>
                            
                            <button class="botonMarcador" data-id="<?php echo $ruta['id_ruta']; ?>">
                                <img src="Img/Icons/favorito_solid.png" alt="Favorito" class="iconoFavorito">
                            </button>
                        </article>
            <?php
                    }
                } else {
                    echo "<p style='padding: 2em; color: white; text-align: center;'>No tienes rutas favoritas guardadas.</p>";
                }
            } catch (PDOException $e) {
                echo "<p style='padding: 2em; color: white; text-align: center;'>Error al cargar favoritos: " . $e->getMessage() . "</p>";
            }
            ?>
        </section>
    </main>

    <footer>
        <?php include 'Includes/footer.php'; ?>
    </footer>
</body>

</html>