<?php
session_start();
require_once 'Includes/db.php';

function obtenerRutaPorDificultad($pdo, $dificultad)
{
    if ($pdo) {
        $stmt = $pdo->prepare("SELECT titulo, distancia_km, imagen_url FROM ruta WHERE dificultad = :dificultad LIMIT 1");
        $stmt->bindParam(':dificultad', $dificultad);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    return false;
}

$rutaBaja = obtenerRutaPorDificultad($pdo, 'Baja');
$rutaMedia = obtenerRutaPorDificultad($pdo, 'Media');
$rutaAlta = obtenerRutaPorDificultad($pdo, 'Alta');

$bajaDisplay = [
    'img' => (!empty($rutaBaja) && !empty($rutaBaja['imagen_url'])) ? htmlspecialchars($rutaBaja['imagen_url']) : 'Img/mountain_list_5.jpg',
    'title' => (!empty($rutaBaja) && !empty($rutaBaja['titulo'])) ? htmlspecialchars($rutaBaja['titulo']) : 'EL DESPERTAR',
    'dist' => (!empty($rutaBaja) && !empty($rutaBaja['distancia_km'])) ? htmlspecialchars($rutaBaja['distancia_km']) . 'KM' : '6KM'
];

$mediaDisplay = [
    'img' => (!empty($rutaMedia) && !empty($rutaMedia['imagen_url'])) ? htmlspecialchars($rutaMedia['imagen_url']) : 'Img/mountain_list_2.jpg',
    'title' => (!empty($rutaMedia) && !empty($rutaMedia['titulo'])) ? htmlspecialchars($rutaMedia['titulo']) : 'LA MAÑANA',
    'dist' => (!empty($rutaMedia) && !empty($rutaMedia['distancia_km'])) ? htmlspecialchars($rutaMedia['distancia_km']) . 'KM' : '13KM'
];

$altaDisplay = [
    'img' => (!empty($rutaAlta) && !empty($rutaAlta['imagen_url'])) ? htmlspecialchars($rutaAlta['imagen_url']) : 'Img/mountain_list_3.jpg',
    'title' => (!empty($rutaAlta) && !empty($rutaAlta['titulo'])) ? htmlspecialchars($rutaAlta['titulo']) : 'LA CIMA',
    'dist' => (!empty($rutaAlta) && !empty($rutaAlta['distancia_km'])) ? htmlspecialchars($rutaAlta['distancia_km']) . 'KM' : '27KM'
];

if (isset($_GET['cerrar_sesion'])) {
    session_destroy();
    header("Location: index.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <link rel="stylesheet" href="Includes/styles.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aventura</title>
</head>

<body id="top">

    <header class="portada">
        <?php include 'Includes/header.php'; ?>

        <div class="portadaContenido">
            <h1 class="tituloPortada">AVENTURA</h1>

            <div class="portadaGrid">
                <div class="portadaIconos">
                    <div class="cajaIcono"><img src="Img/Icons/person.png" alt="Senderismo"></div>
                    <div class="cajaIcono"><img src="Img/Icons/camping.png" alt="Camping"></div>
                    <div class="cajaIcono"><img src="Img/Icons/ciclismo.png" alt="Ciclismo"></div>
                    <div class="cajaIcono"><img src="Img/Icons/esqui.png" alt="Esquí"></div>
                </div>

                <div class="portadaTextoGrupo">
                    <p class="portadaDescripcion">
                        Amante de la naturaleza y con ganas de conocer las grandes maravillas que te entrega este país,
                        en este lugar encontrarás las mejores rutas, datos y tod...
                    </p>
                    <a href="category_page.php" class="botonBorde">Descubre más <img src="Img/Icons/arrow_right.png"
                            alt="Flecha" class="iconoFlecha"></a>
                </div>
            </div>
        </div>

        <div class="portadaImagenFondo"></div>
    </header>

    <main class="contenedorPrincipal">
        <section class="seccionInfo">
            <div class="infoTexto">
                <h2>Aventura<br>en la naturaleza</h2>
                <p>Cuando uno ama algo lo respeta, si tu amor es por la naturaleza valorarás el medio ambiente en el que
                    vivimos, los animales, las plantas, todo aquello que hace posible la vida en este planeta.</p>
                <a href="category_page.php" class="enlaceFlecha">Ver catálogo <img src="Img/Icons/arrow_right.png"
                        alt="Flecha" class="iconoFlecha"></a>
            </div>

            <div class="infoTarjeta">
                <div class="contenedorVideo">
                    <video autoplay muted loop playsinline class="videoFondo">
                        <source src="Img/mountain_video.mp4" type="video/mp4">
                        Tu navegador no soporta video HTML5.
                    </video>
                    <div class="superposicionPlay">
                        <img src="Img/Icons/button_play.png" alt="Play" class="iconoPlay">
                        <span>Aventura todos los días<br>En los mejores recorridos</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="seccionSenderos">
            <h2 class="tituloSenderos">Selecciona tu ruta por niveles</h2>
            <a href="category_page.php?dificultad=baja" class="tarjetaSendero">
                <img src="<?php echo $bajaDisplay['img']; ?>" alt="Senderismo nivel bajo">
                <span class="badge">Nivel Bajo</span>
                <div class="detallesTarjeta">
                    <h3><?php echo $bajaDisplay['title']; ?></h3>
                    <span class="distance"><?php echo $bajaDisplay['dist']; ?></span>
                </div>
            </a>

            <a href="category_page.php?dificultad=media" class="tarjetaSendero">
                <img src="<?php echo $mediaDisplay['img']; ?>" alt="Senderismo nivel medio">
                <span class="badge">Nivel Medio</span>
                <div class="detallesTarjeta">
                    <h3><?php echo $mediaDisplay['title']; ?></h3>
                    <span class="distance"><?php echo $mediaDisplay['dist']; ?></span>
                </div>
            </a>

            <a href="category_page.php?dificultad=alta" class="tarjetaSendero">
                <img src="<?php echo $altaDisplay['img']; ?>" alt="Senderismo nivel alto">
                <span class="badge">Nivel Alto</span>
                <div class="detallesTarjeta">
                    <h3><?php echo $altaDisplay['title']; ?></h3>
                    <span class="distance"><?php echo $altaDisplay['dist']; ?></span>
                </div>
            </a>
        </section>
    </main>

    <footer>
        <?php include 'Includes/footer.php'; ?>
    </footer>
</body>

</html>