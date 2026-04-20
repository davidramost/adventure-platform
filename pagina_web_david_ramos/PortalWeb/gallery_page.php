<?php
session_start();
require_once 'Includes/db.php';

try {
    $stmt = $pdo->query("SELECT id_ruta, nombre_ruta, imagen_url FROM ruta");
    $rutas = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Error al cargar las rutas: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <link rel="stylesheet" href="Includes/styles.css?v=<?php echo time(); ?>">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Galería de Rutas</title>
    <script src="./libraries/jquery/jquery.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
</head>

<body id="top">
    <header class="header-general">
        <?php include 'Includes/header.php'; ?>
    </header>

    <section class="titulo-galeria" style="background: linear-gradient(135deg, #455A64 0%, #263238 100%); padding: 2em 3em; text-align: center;">
        <h1 class="tituloPortada" style="font-size: 40px; margin: 0;">GALERÍA DE RUTAS</h1>
    </section>

    <main>
        <section class="rutaSeccion">
            <div class="contenidoRuta">

                <div class="swiper mySwiper">
                    <div class="swiper-wrapper">
                        <?php foreach ($rutas as $ruta): ?>
                            <div class="swiper-slide">
                                <a href="content_page.php?id=<?php echo $ruta['id_ruta']; ?>" style="display:block; width:100%; height:100%;">
                                    <?php if (!empty($ruta['imagen_url'])): ?>
                                        <img src="<?php echo htmlspecialchars($ruta['imagen_url']); ?>" alt="<?php echo htmlspecialchars($ruta['nombre_ruta']); ?>" style="width:100%; height:100%; object-fit: cover;">
                                    <?php else: ?>
                                        <div class="sinFoto" style="width:100%; height:100%;"><img src="Img/Icons/sin-imagen.png" alt="Sin foto"></div>
                                    <?php endif; ?>
                                    <div class="slide-caption">
                                        <h3><?php echo htmlspecialchars($ruta['nombre_ruta']); ?></h3>
                                    </div>
                                </a>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <div class="swiper-button-next"></div>
                    <div class="swiper-button-prev"></div>
                    <div class="swiper-pagination"></div>
                </div>

                <nav class="paginacion" style="margin-top: 30px; text-align: center;">
                    <a href="category_page.php" class="botonVolver">Volver al listado</a>
                </nav>
            </div>
        </section>
    </main>

    <footer>
        <?php include 'Includes/footer.php'; ?>
    </footer>

    <script>
        var swiper = new Swiper(".mySwiper", {
            spaceBetween: 30,
            centeredSlides: true,
            autoplay: {
                delay: 3500,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            loop: true,
        });

        function toggleMenu() {
            var x = document.getElementById("navLinks");
            if (x.style.display === "block") {
                x.style.display = "none";
            } else {
                x.style.display = "block";
            }
        }
    </script>
</body>

</html>