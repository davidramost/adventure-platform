<?php
session_start();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Información Legal</title>
    <link rel="stylesheet" href="Includes/styles.css?v=<?php echo time(); ?>">
</head>
<body id="top">

    <header class="header-general">
        <?php include 'Includes/header.php'; ?>
    </header>

    <main class="info-page-main">
        <section class="info-section">
            <?php
            $type = isset($_GET['type']) ? $_GET['type'] : 'default';

            switch ($type) {
                case 'work':
                    echo '<h1>Trabaja con Nosotros</h1>';
                    echo '<div class="info-text">
                            <p>En <strong>Senderos</strong>, somos un equipo impulsado por dos grandes pasiones: la tecnología y la naturaleza. Este proyecto nació del deseo de conectar a las personas con el medio ambiente a través de una plataforma digital intuitiva y moderna.</p>
                            <p>Buscamos desarrolladores, diseñadores y creadores de contenido que compartan nuestro entusiasmo por el senderismo y la conservación ambiental. Trabajamos de forma remota, organizamos rutas de equipo y fomentamos un equilibrio saludable entre la vida laboral y la aventura al aire libre.</p>
                            <p>Si te emociona la idea de construir herramientas que ayuden a otros a descubrir el mundo, ¡queremos conocerte!</p>
                            <p><em>(Esta es una página de demostración con información ficticia para el proyecto de desarrollo web).</em></p>
                          </div>';
                    break;

                case 'privacy':
                    echo '<h1>Política de Privacidad</h1>';
                    echo '<div class="info-text">
                            <p>En Senderos, nos tomamos muy en serio tu privacidad (aunque seamos una web ficticia). A continuación, detallamos cómo NO gestionamos tus datos:</p>
                            <ul style="list-style-type: disc; padding-left: 20px; text-align: left;">
                                <li><strong>Recopilación de datos:</strong> Solo guardamos las rutas que visitas en tus sueños.</li>
                                <li><strong>Uso de la información:</strong> Utilizamos tus datos para enviarte señales de humo virtuales.</li>
                                <li><strong>Compartir datos:</strong> No compartimos tus datos con terceros, a menos que sean ardillas del bosque.</li>
                                <li><strong>Derechos del usuario:</strong> Tienes derecho a olvidar que leíste esto.</li>
                            </ul>
                            <p><em>(Información legal ficticia con fines demostrativos).</em></p>
                          </div>';
                    break;

                case 'cookies':
                    echo '<h1>Política de Cookies</h1>';
                    echo '<div class="info-text">
                            <p>Nuestra política de cookies es simple: nos encantan, especialmente las de chocolate.</p>
                            <p>En cuanto a las cookies digitales:</p>
                            <ul style="list-style-type: disc; padding-left: 20px; text-align: left;">
                                <li>Usamos cookies estrictamente necesarias para que la web no se desmorone como una galleta mojada en leche.</li>
                                <li>No usamos cookies de rastreo porque preferimos seguir rastros en el bosque.</li>
                            </ul>
                            <p>Al continuar navegando, aceptas que te entre hambre de galletas.</p>
                            <p><em>(Información legal ficticia con fines demostrativos).</em></p>
                          </div>';
                    break;

                case 'legal':
                    echo '<h1>Acuerdo Legal</h1>';
                    echo '<div class="info-text">
                            <p>Bienvenido al Acuerdo Legal de Senderos.</p>
                            <p>1. <strong>Uso del sitio:</strong> Al usar este sitio, aceptas que es un proyecto académico y no una agencia de viajes real.</p>
                            <p>2. <strong>Responsabilidad:</strong> No nos hacemos responsables si te pierdes en una ruta (física o digitalmente). Lleva siempre mapa y brújula.</p>
                            <p>3. <strong>Propiedad Intelectual:</strong> Todo el código pertenece a David Ramos, pero las montañas pertenecen a todos.</p>
                            <p>4. <strong>Modificaciones:</strong> Nos reservamos el derecho de cambiar este acuerdo cada vez que cambie el viento.</p>
                            <p><em>(Información legal ficticia con fines demostrativos).</em></p>
                          </div>';
                    break;

                default:
                    echo '<h1>Información</h1>';
                    echo '<p>Selecciona una opción del pie de página para ver más información.</p>';
                    break;
            }
            ?>
        </section>
    </main>

    <footer>
        <?php include 'Includes/footer.php'; ?>
    </footer>

</body>
</html>
