<?php
session_start();
require_once 'Includes/db.php';

$search = isset($_POST['search']) ? $_POST['search'] : '';
$id_usuario = isset($_SESSION['id_usuario']) ? $_SESSION['id_usuario'] : 0;

try {
    $sql = "SELECT r.*, u.nombre as nombre_ubicacion,
            (SELECT AVG(puntuacion) FROM resena WHERE id_ruta = r.id_ruta) as media_puntuacion,
            (SELECT COUNT(*) FROM favorito WHERE id_ruta = r.id_ruta AND id_usuario = :id_usuario) as es_favorito  
            FROM ruta r 
            JOIN ubicacion u ON r.id_ubicacion = u.id_ubicacion";

    if (!empty($search)) {
        $sql .= " WHERE r.nombre_ruta LIKE :search OR u.nombre LIKE :search";
    }

    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':id_usuario', $id_usuario);

    if (!empty($search)) {
        $stmt->bindValue(':search', '%' . $search . '%');
    }

    $stmt->execute();

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
                            <span><img src="Img/Icons/star.png" alt="Estrella" class="iconoEstrella"> <?php echo number_format((float)$ruta['media_puntuacion'], 1); ?></span>
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

                <?php if (isset($_SESSION['rol']) && $_SESSION['rol'] === 'admin'): ?>
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
        echo "<p style='padding: 2em; color: white; text-align: center;'>No se encontraron rutas que coincidan con su búsqueda.</p>";
    }
} catch (PDOException $e) {
    echo "<p style='padding: 2em; color: white; text-align: center;'>Error al cargar las rutas: " . $e->getMessage() . "</p>";
}
?>