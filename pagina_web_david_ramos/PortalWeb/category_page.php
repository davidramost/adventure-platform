<?php
session_start();
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <link rel="stylesheet" href="Includes/styles.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuestra selección de rutas - Aventura</title>
    <script src="./libraries/jquery/jquery.js"></script>
    <script src="./js/favorites.js"></script>
</head>

<body id="top">

    <header class="header-general">
        <?php include 'Includes/header.php'; ?>
    </header>

    <main class="categoriaPrincipal">
        <div class="categoriaToolbar">
            <h1>Nuestra selección de rutas</h1>
            <div class="cajaBusqueda">
                <input type="text" id="searchInput" placeholder="Buscar...">
                <button type="submit"><img src="Img/Icons/search.png" alt="Buscar" class="iconoBuscar"></button>
            </div>
        </div>

        <section class="listaRutas">
            <?php
            require_once 'Includes/db.php';

            try {
                $id_usuario = isset($_SESSION['id_usuario']) ? $_SESSION['id_usuario'] : 0;

                $sql = "SELECT r.*, u.nombre as nombre_ubicacion,
                        COALESCE((SELECT AVG(puntuacion) FROM resena WHERE id_ruta = r.id_ruta), 0) as media_puntuacion,
                        (SELECT COUNT(*) FROM favorito WHERE id_ruta = r.id_ruta AND id_usuario = :id_usuario) as es_favorito
                        FROM ruta r 
                        JOIN ubicacion u ON r.id_ubicacion = u.id_ubicacion";

                $params = [':id_usuario' => $id_usuario];
                if (isset($_GET['dificultad'])) {
                    $dificultad = $_GET['dificultad'];

                    $sql .= " WHERE r.dificultad LIKE :dificultad";
                    $params[':dificultad'] = $dificultad;
                }

                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);
                $rutas = $stmt->fetchAll(PDO::FETCH_ASSOC);

                if (count($rutas) > 0) {
                    foreach ($rutas as $ruta) {
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
                                <?php if ($ruta['es_favorito'] > 0): ?>
                                    <img src="Img/Icons/favorito_solid.png" alt="Favorito" class="iconoFavorito">
                                <?php else: ?>
                                    <img src="Img/Icons/favourite.png" alt="Favorito" class="iconoFavorito">
                                <?php endif; ?>
                            </button>

                            <?php
                            if (isset($_SESSION['rol']) && $_SESSION['rol'] === 'admin'):
                            ?>
                                <form action="delete_route.php" method="POST" class="formEliminar" onsubmit="return confirm('¿Estás seguro de que quieres eliminar esta ruta?');" style="position: absolute; top: 10px; left: 10px; z-index: 10;">
                                    <input type="hidden" name="id_ruta" value="<?php echo $ruta['id_ruta']; ?>">
                                    <button type="submit" class="botonEliminar" style="background: none; border: none; cursor: pointer;">
                                        <img src="Img/Icons/delete.png" alt="Eliminar" title="Eliminar ruta" style="width: 24px; height: 24px;">
                                    </button>
                                </form>
                            <?php endif; ?>
                        </article>

            <?php
                    }
                } else {
                    echo "<p>No hay rutas disponibles actualmente.</p>";
                }
            } catch (PDOException $e) {
                echo "<p>Error al cargar las rutas: " . $e->getMessage() . "</p>";
            }
            ?>
        </section>


    </main>

    <footer>
        <?php include 'Includes/footer.php'; ?>
    </footer>

    <script>
        $(document).ready(function() {
            $('#searchInput').keyup(function() {
                var search = $(this).val();
                if (search.length > 3) {
                    $.ajax({
                        url: 'ajax_search_routes.php',
                        type: 'POST',
                        data: {
                            search: search
                        },
                        success: function(response) {
                            $('.listaRutas').html(response);
                        }
                    });
                } else if (search.length == 0) {
                    $.ajax({
                        url: 'ajax_search_routes.php',
                        type: 'POST',
                        data: {
                            search: ''
                        },
                        success: function(response) {
                            $('.listaRutas').html(response);
                        }
                    });
                }
            });
        });
    </script>
</body>

</html>