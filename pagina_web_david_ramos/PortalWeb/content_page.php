<?php
session_start();
require_once 'Includes/db.php';

$id_ruta = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$ruta = null;

if ($id_ruta > 0) {
    try {
        $stmt = $pdo->prepare("SELECT r.*, u.latitud, u.longitud FROM ruta r JOIN ubicacion u ON r.id_ubicacion = u.id_ubicacion WHERE r.id_ruta = :id");
        $stmt->execute([':id' => $id_ruta]);
        $ruta = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        die("Error al cargar la ruta: " . $e->getMessage());
    }
}

if (!$ruta) {
    header("Location: category_page.php");
    exit();
}

$gpx_map = [
    1 => 'bejarano',
    2 => 'ermita',
    3 => 'almodovar',
    4 => 'bailon',
    5 => 'muriano'
];

$gpx_file = isset($gpx_map[$id_ruta]) ? $gpx_map[$id_ruta] : 'bejarano';

$weather_data = null;
$weather_error = null;

if ($ruta && !empty($ruta['latitud']) && !empty($ruta['longitud'])) {
    $api_key = "cd68960265d272422570f363eaccffd1";
    $lat = $ruta['latitud'];
    $lon = $ruta['longitud'];
    $url = "https://api.openweathermap.org/data/2.5/weather?lat={$lat}&lon={$lon}&appid={$api_key}&units=metric&lang=es";

    $response = @file_get_contents($url);
    if ($response !== false) {
        $weather_data = json_decode($response, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $weather_error = "Error al procesar datos del tiempo.";
            $weather_data = null;
        }
    } else {
        $weather_error = "No se pudo obtener los datos del tiempo";
    }
} else {
    $weather_error = "En esta ruta no se ha aportado una ubicación precisa para proporcionar los datos del temporal";
}

$mensajeResena = "";
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['submit_review'])) {
    if (!isset($_SESSION['id_usuario'])) {
        header("Location: login.php");
        exit();
    }

    $id_usuario = $_SESSION['id_usuario'];
    $comentario = trim($_POST['comentario']);
    $puntuacion = (int)$_POST['puntuacion'];
    $fecha = date('Y-m-d');

    if ($puntuacion < 1 || $puntuacion > 5) {
        $mensajeResena = "La puntuación debe estar entre 1 y 5.";
    } elseif (empty($comentario)) {
        $mensajeResena = "El comentario no puede estar vacío.";
    } else {
        $stmtCheck = $pdo->prepare("SELECT id_resena FROM resena WHERE id_ruta = ? AND id_usuario = ?");
        $stmtCheck->execute([$id_ruta, $id_usuario]);

        if ($stmtCheck->rowCount() > 0) {
            $mensajeResena = "Ya has publicado una reseña para esta ruta.";
        } else {
            try {
                $stmtInsert = $pdo->prepare("INSERT INTO resena (id_ruta, id_usuario, comentario, puntuacion, fecha) VALUES (?, ?, ?, ?, ?)");
                $stmtInsert->execute([$id_ruta, $id_usuario, $comentario, $puntuacion, $fecha]);
                $mensajeResena = "¡Reseña publicada con éxito!";
                header("Location: content_page.php?id=" . $id_ruta);
                exit();
            } catch (PDOException $e) {
                $mensajeResena = "Error al guardar la reseña: " . $e->getMessage();
            }
        }
    }
}

$resenas = [];
try {
    $stmtResenas = $pdo->prepare("
        SELECT r.*, u.nombre_usuario 
        FROM resena r 
        JOIN usuario u ON r.id_usuario = u.id_usuario 
        WHERE r.id_ruta = ? 
        ORDER BY r.fecha DESC, r.id_resena DESC
    ");
    $stmtResenas->execute([$id_ruta]);
    $resenas = $stmtResenas->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    $resenas = [];
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <link rel="stylesheet" href="Includes/styles.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pantalla de contenido</title>
    <script src="./libraries/jquery/jquery.js"></script>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.7.0/gpx.min.js"></script>
</head>

<body id="top">


    <header class="header-general">
        <?php include 'Includes/header.php'; ?>
    </header>

    <main>
        <section class="rutaSeccion">
            <div class="contenidoRuta">


                <div class="header-grid">
                    <div class="imagenPrincipal">
                        <?php if (!empty($ruta['imagen_url'])): ?>
                            <img src="<?php echo htmlspecialchars($ruta['imagen_url']); ?>" alt="Imagen ruta">
                        <?php else: ?>
                            <div class="sinFoto"><img src="Img/Icons/sin-imagen.png" alt="Sin foto"></div>
                        <?php endif; ?>
                    </div>

                    <article class="descripcionRuta">
                        <h1><?php echo htmlspecialchars(strtoupper($ruta['dificultad'])); ?></h1>
                        <h2><?php echo htmlspecialchars($ruta['nombre_ruta']); ?></h2>

                        <div class="detallesRuta" style="margin-bottom: 20px;">
                            <p><strong>Distancia:</strong> <?php echo htmlspecialchars($ruta['distancia_km']); ?> km</p>
                            <p><strong>Duración:</strong> <?php echo htmlspecialchars($ruta['duracion_estimada']); ?></p>
                            <p><strong>Desnivel:</strong> <?php echo htmlspecialchars($ruta['desnivel_metros']); ?> m</p>
                        </div>

                        <div class="textoDescripcion">
                            <p><?php echo nl2br(htmlspecialchars($ruta['descripcion'])); ?></p>
                        </div>
                    </article>
                </div>

                <div class="info-container">
                    <div id="map"></div>
                    <div id="seccionTiempoContainer">
                        <?php if ($weather_data): ?>
                            <div class="seccionTiempo">
                                <h3>Condiciones del tiempo</h3>
                                <div class="tarjetaTiempo">
                                    <div class="temperaturaInfo">
                                        <p class="temperatura"><?php echo round($weather_data['main']['temp']); ?>°C</p>
                                        <p class="sensacionTermica">Sensación térmica: <?php echo round($weather_data['main']['feels_like']); ?>°C</p>
                                    </div>
                                    <div class="detallesTiempo">
                                        <p><strong>Descripción:</strong> <?php echo ucfirst($weather_data['weather'][0]['description']); ?></p>
                                        <p><strong>Humedad:</strong> <?php echo $weather_data['main']['humidity']; ?>%</p>
                                        <p><strong>Velocidad del viento:</strong> <?php echo $weather_data['wind']['speed']; ?> m/s</p>
                                        <p><strong>Presión:</strong> <?php echo $weather_data['main']['pressure']; ?> hPa</p>
                                    </div>
                                </div>
                            </div>
                        <?php elseif ($weather_error): ?>
                            <div class="alertaTiempo">
                                <p><strong>Nota:</strong> <?php echo htmlspecialchars($weather_error); ?></p>

                                <div class="consejosSeguridad">
                                    <p><strong>⚠️ Advertencia de seguridad:</strong></p>
                                    <p>Realizar rutas de senderismo sin conocer las condiciones meteorológicas puede ser peligroso. Te recomendamos encarecidamente:</p>
                                    <ul>
                                        <li>Consultar la previsión meteorológica para la zona antes de salir.</li>
                                        <li>Llevar ropa y equipo adecuado para cambios repentinos de tiempo.</li>
                                        <li>Evitar zonas de riesgo en caso de lluvia o tormenta.</li>
                                    </ul>
                                    <p class="enlace-tiempo-container">
                                        Puedes consultar el tiempo en:
                                        <a href="https://weather.com/es-ES/tiempo/hoy/l/SPXX0021:1:SP" target="_blank">The Weather Channel</a>
                                        o
                                        <a href="https://www.aemet.es/" target="_blank">AEMET</a>.
                                    </p>
                                </div>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>

                <div class="seccionComentarios">
                    <h3>Comentarios (<?php echo count($resenas); ?>)</h3>

                    <?php if (isset($_SESSION['usuario'])): ?>
                        <?php if ($mensajeResena): ?>
                            <div class="<?php echo strpos($mensajeResena, 'éxito') !== false ? 'mensajeExito' : 'mensajeError'; ?>">
                                <?php echo $mensajeResena; ?>
                            </div>
                        <?php endif; ?>

                        <form method="POST" action="" class="formularioResena">
                            <div class="form-group">
                                <label>Puntuación:</label>
                                <div class="rating-input">
                                    <?php for ($i = 5; $i >= 1; $i--): ?>
                                        <input type="radio" id="star<?php echo $i; ?>" name="puntuacion" value="<?php echo $i; ?>" required>
                                        <label for="star<?php echo $i; ?>">★</label>
                                    <?php endfor; ?>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="comentario">Tu opinión:</label>
                                <textarea name="comentario" id="comentario" rows="4" required placeholder="Comparte tu experiencia..."></textarea>
                            </div>
                            <button type="submit" name="submit_review" class="botonGuardar">Publicar Reseña</button>
                        </form>
                    <?php else: ?>
                        <div class="login-prompt">
                            <p>Para dejar una reseña, necesitas <a href="login.php">iniciar sesión</a>.</p>
                        </div>
                    <?php endif; ?>

                    <div class="listaResenas">
                        <?php if (empty($resenas)): ?>
                            <p class="no-resenas">No hay reseñas todavía. ¡Sé el primero en comentar!</p>
                        <?php else: ?>
                            <?php foreach ($resenas as $resena): ?>
                                <div class="tarjetaResena">
                                    <div class="resenaHeader">
                                        <div class="resenaUserInfo">
                                            <span class="resenaUsuario"><?php echo htmlspecialchars($resena['nombre_usuario']); ?></span>
                                            <div class="resenaRatingStatic">
                                                <?php for ($i = 1; $i <= 5; $i++): ?>
                                                    <span class="star-static <?php echo $i <= $resena['puntuacion'] ? 'filled' : ''; ?>">★</span>
                                                <?php endfor; ?>
                                            </div>
                                        </div>
                                        <span class="resenaFecha"><?php echo date('d/m/Y', strtotime($resena['fecha'])); ?></span>
                                        <?php if (isset($_SESSION['rol']) && $_SESSION['rol'] === 'admin'): ?>
                                            <form action="delete_review.php" method="POST" onsubmit="return confirm('¿Estás seguro de que quieres eliminar esta reseña?');" style="display:inline-block; margin-left: 10px;">
                                                <input type="hidden" name="id_resena" value="<?php echo $resena['id_resena']; ?>">
                                                <input type="hidden" name="id_ruta" value="<?php echo $id_ruta; ?>">
                                                <button type="submit" style="background:none; border:none; cursor:pointer;" title="Eliminar reseña">
                                                    <img src="Img/Icons/delete.png" alt="Eliminar" style="width: 20px; height: 20px;">
                                                </button>
                                            </form>
                                        <?php endif; ?>
                                    </div>
                                    <div class="resenaBody">
                                        <p><?php echo nl2br(htmlspecialchars($resena['comentario'])); ?></p>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>

                <nav class="paginacion">
                    <a href="category_page.php" class="botonVolver">Volver al listado</a>
                </nav>
            </div>
        </section>
    </main>

    <footer>
        <?php include 'Includes/footer.php'; ?>
    </footer>

    <script>
        $(document).ready(function() {

            var map = L.map('map').setView([37.93, -4.89], 14);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            var gpx = 'get_gpx.php?ruta=<?php echo htmlspecialchars($gpx_file); ?>';

            fetch(gpx)
                .then(response => {
                    if (!response.ok) {
                        response.text().then(text => {
                            alert('ERROR CRÍTICO: ' + response.status + '\n' + text);
                        });
                    } else {
                        console.log('Archivo GPX encontrado correctamente.');
                    }
                })
                .catch(error => {
                    alert('ERROR DE RED: No se pudo intentar cargar el archivo.\n' + error);
                });

            new L.GPX(gpx, {
                async: true,
                marker_options: {
                    //TODO, quitar imágenes online
                    startIconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.7.0/pin-icon-start.png',
                    endIconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.7.0/pin-icon-end.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.7.0/pin-shadow.png'
                }
            }).on('loaded', function(e) {
                map.fitBounds(e.target.getBounds());
            }).addTo(map);
        });
    </script>
</body>

</html>