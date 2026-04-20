<?php
session_start();
require_once 'Includes/db.php';

if (!isset($_SESSION['id_usuario'])) {
    header("Location: login.php");
    exit();
}

$error = "";
$exito_imagenes = "";

$imagenes_info = $_SESSION['imagenes_subidas_info'] ?? [];
$imagenes_paths = $_SESSION['imagenes_subidas_paths'] ?? [];

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
    $accion = $_POST['accion'] ?? '';

    if ($accion === 'examinar') {
        if (!empty($imagenes_paths)) {
            foreach ($imagenes_paths as $ruta_antigua) {
                if (file_exists($ruta_antigua)) {
                    unlink($ruta_antigua);
                }
            }
        }
        $imagenes_info = [];
        $imagenes_paths = [];

        if (isset($_FILES['imagenRuta']) && !empty($_FILES['imagenRuta']['name'])) {
            $files = $_FILES['imagenRuta'];
            $count = 1;

            if (false) {
                $error = "";
            } else {
                if (!is_dir('Img/Usuarios')) {
                    mkdir('Img/Usuarios', 0755, true);
                }

                $valid_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
                $max_size = 3 * 1024 * 1024;

                for ($i = 0; $i < $count; $i++) {
                    if ($files['error'] === UPLOAD_ERR_OK) {
                        $nombre_archivo = basename($files['name']);
                        $tamano_archivo = $files['size'];

                        if ($tamano_archivo > $max_size) {
                            $error = "La imagen '$nombre_archivo' supera el límite de 3MB.";
                            break;
                        }

                        $ext = strtolower(pathinfo($nombre_archivo, PATHINFO_EXTENSION));
                        if (!in_array($ext, $valid_extensions)) {
                            $error = "Formato de imagen no válido: $nombre_archivo. Solo JPG, JPEG, PNG, GIF, WEBP.";
                            break;
                        }

                        $nombre_unico = uniqid() . "_" . $nombre_archivo;
                        $ruta_destino = "Img/Usuarios/" . $nombre_unico;

                        if (move_uploaded_file($files['tmp_name'], $ruta_destino)) {
                            $imagenes_paths[] = $ruta_destino;
                            $imagenes_info[] = [
                                'nombre' => $nombre_archivo,
                                'tamano' => formatearTamano($tamano_archivo),
                                'tamano_bytes' => $tamano_archivo,
                                'ruta' => $ruta_destino
                            ];
                        } else {
                            $error = "Error al subir la imagen '$nombre_archivo'.";
                            break;
                        }
                    } elseif ($files['error'] === UPLOAD_ERR_INI_SIZE || $files['error'] === UPLOAD_ERR_FORM_SIZE) {
                        $nombre_archivo = basename($files['name']);
                        $error = "La imagen '$nombre_archivo' supera el tamaño máximo permitido de 3MB.";
                        break;
                    }
                }

                if (empty($error) && !empty($imagenes_paths)) {
                    $_SESSION['imagenes_subidas_info'] = $imagenes_info;
                    $_SESSION['imagenes_subidas_paths'] = $imagenes_paths;
                    $exito_imagenes = "Imagen cargada correctamente.";
                } else {
                    foreach ($imagenes_paths as $ruta) {
                        if (file_exists($ruta)) {
                            unlink($ruta);
                        }
                    }
                    $imagenes_info = [];
                    $imagenes_paths = [];
                    unset($_SESSION['imagenes_subidas_info'], $_SESSION['imagenes_subidas_paths']);
                }
            }
        } else {
            $error = "No se ha seleccionado ninguna imagen.";
        }
    } elseif ($accion === 'guardar') {
        $titulo = trim($_POST['tituloRuta'] ?? '');
        $nombre_ruta = trim($_POST['nombreRuta'] ?? '');
        $nivel = $_POST['nivelRuta'] ?? '';
        $dificultad_map = [
            'bajo' => 'Baja',
            'medio' => 'Media',
            'alto' => 'Alta'
        ];
        $dificultad = isset($dificultad_map[$nivel]) ? $dificultad_map[$nivel] : ucfirst($nivel);

        $distancia = floatval($_POST['distanciaRuta'] ?? 0);
        $desnivel = intval($_POST['desnivelRuta'] ?? 0);
        $horas = intval($_POST['duracionHoras'] ?? 0);
        $minutos = intval($_POST['duracionMinutos'] ?? 0);
        $ubicacion_nombre = trim($_POST['ubicacionRuta'] ?? '');
        $latitud = !empty($_POST['latitudUbicacion']) ? floatval($_POST['latitudUbicacion']) : null;
        $longitud = !empty($_POST['longitudUbicacion']) ? floatval($_POST['longitudUbicacion']) : null;

        if (($latitud !== null && $longitud === null) || ($latitud === null && $longitud !== null)) {
            $error = "Si proporcionas coordenadas, debes incluir tanto latitud como longitud.";
        }

        $descripcion = trim($_POST['descripcionRuta'] ?? '');
        $recomendaciones = trim($_POST['recomendacionesRuta'] ?? '');

        $duracion_estimada = "{$horas}h {$minutos}m";

        if (!empty($recomendaciones)) {
            $descripcion .= "\n\nRecomendaciones: " . $recomendaciones;
        }

        if (empty($imagenes_paths) && isset($_FILES['imagenRuta']) && !empty($_FILES['imagenRuta']['name']) && $_FILES['imagenRuta']['error'] === UPLOAD_ERR_OK) {
            if (!is_dir('Img/Usuarios')) {
                mkdir('Img/Usuarios', 0755, true);
            }
            $valid_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            $max_size = 3 * 1024 * 1024;
            $nombre_archivo = basename($_FILES['imagenRuta']['name']);
            $tamano_archivo = $_FILES['imagenRuta']['size'];
            $ext = strtolower(pathinfo($nombre_archivo, PATHINFO_EXTENSION));

            if ($tamano_archivo > $max_size) {
                $error = "La imagen '$nombre_archivo' supera el límite de 3MB.";
            } elseif (!in_array($ext, $valid_extensions)) {
                $error = "Formato de imagen no válido: $nombre_archivo. Solo JPG, JPEG, PNG, GIF, WEBP.";
            } else {
                $nombre_unico = uniqid() . "_" . $nombre_archivo;
                $ruta_destino = "Img/Usuarios/" . $nombre_unico;
                if (move_uploaded_file($_FILES['imagenRuta']['tmp_name'], $ruta_destino)) {
                    $imagenes_paths = [$ruta_destino];
                } else {
                    $error = "Error al subir la imagen '$nombre_archivo'.";
                }
            }
        }

        $imagen_url = !empty($imagenes_paths) ? $imagenes_paths[0] : "";

        if (empty($error)) {
            try {
                $pdo->beginTransaction();

                $stmt_ubi = $pdo->prepare("INSERT INTO ubicacion (nombre, latitud, longitud) VALUES (?, ?, ?)");
                $stmt_ubi->execute([$ubicacion_nombre, $latitud, $longitud]);
                $id_ubicacion = $pdo->lastInsertId();

                $stmt_ruta = $pdo->prepare("INSERT INTO ruta (id_usuario, id_ubicacion, titulo, nombre_ruta, descripcion, distancia_km, duracion_estimada, dificultad, desnivel_metros, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt_ruta->execute([
                    $_SESSION['id_usuario'],
                    $id_ubicacion,
                    $titulo,
                    $nombre_ruta,
                    $descripcion,
                    $distancia,
                    $duracion_estimada,
                    $dificultad,
                    $desnivel,
                    $imagen_url
                ]);

                $pdo->commit();

                unset($_SESSION['imagenes_subidas_info'], $_SESSION['imagenes_subidas_paths']);

                header("Location: index.php");
                exit();
            } catch (Exception $e) {
                $pdo->rollBack();
                $error = "Error en la base de datos: " . $e->getMessage();
            }
        }
    }
}

$form_values = [
    'tituloRuta' => htmlspecialchars($_POST['tituloRuta'] ?? ''),
    'nombreRuta' => htmlspecialchars($_POST['nombreRuta'] ?? ''),
    'nivelRuta' => $_POST['nivelRuta'] ?? '',
    'distanciaRuta' => htmlspecialchars($_POST['distanciaRuta'] ?? ''),
    'desnivelRuta' => htmlspecialchars($_POST['desnivelRuta'] ?? ''),
    'duracionHoras' => htmlspecialchars($_POST['duracionHoras'] ?? ''),
    'duracionMinutos' => htmlspecialchars($_POST['duracionMinutos'] ?? ''),
    'ubicacionRuta' => htmlspecialchars($_POST['ubicacionRuta'] ?? ''),
    'latitudUbicacion' => htmlspecialchars($_POST['latitudUbicacion'] ?? ''),
    'longitudUbicacion' => htmlspecialchars($_POST['longitudUbicacion'] ?? ''),
    'descripcionRuta' => htmlspecialchars($_POST['descripcionRuta'] ?? ''),
    'recomendacionesRuta' => htmlspecialchars($_POST['recomendacionesRuta'] ?? ''),
];
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <link rel="stylesheet" href="Includes/styles.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crear Nueva Ruta - Aventura</title>
</head>

<body id="top">
    <header class="header-general">
        <?php include 'Includes/header.php'; ?>
    </header>

    <main>
        <section class="rutaSeccion">
            <div class="contenidoRuta">
                <h1>CREAR NUEVA RUTA</h1>

                <?php if ($error): ?>
                    <p class="mensajeError"><?php echo $error; ?></p>
                <?php endif; ?>
                <?php if ($exito_imagenes): ?>
                    <p class="mensajeExito"><?php echo $exito_imagenes; ?></p>
                <?php endif; ?>
                <form class="formularioRuta" action="" method="POST" enctype="multipart/form-data">
                    <div class="formularioGrupo">
                        <label for="tituloRuta">Título de la publicación</label>
                        <input type="text" id="tituloRuta" name="tituloRuta" placeholder="Ej: Aventura en el Bosque" required value="<?php echo $form_values['tituloRuta']; ?>">
                    </div>

                    <div class="formularioGrupo">
                        <label for="nombreRuta">Nombre de la ruta (Lugar)</label>
                        <input type="text" id="nombreRuta" name="nombreRuta" placeholder="Ej: Arroyo del Bejarano" required value="<?php echo $form_values['nombreRuta']; ?>">
                    </div>

                    <div class="formularioFila">
                        <div class="formularioGrupo">
                            <label for="nivelRuta">Nivel de dificultad</label>
                            <select id="nivelRuta" name="nivelRuta" required>
                                <option value="">Selecciona un nivel</option>
                                <option value="bajo" <?php echo $form_values['nivelRuta'] === 'bajo' ? 'selected' : ''; ?>>Nivel Bajo</option>
                                <option value="medio" <?php echo $form_values['nivelRuta'] === 'medio' ? 'selected' : ''; ?>>Nivel Medio</option>
                                <option value="alto" <?php echo $form_values['nivelRuta'] === 'alto' ? 'selected' : ''; ?>>Nivel Alto</option>
                            </select>
                        </div>

                        <div class="formularioGrupo">
                            <label for="distanciaRuta">Distancia (km) *</label>
                            <input type="number" id="distanciaRuta" name="distanciaRuta" placeholder="Ej: 10.5"
                                step="0.1" min="0" required value="<?php echo $form_values['distanciaRuta']; ?>">
                        </div>
                    </div>

                    <div class="formularioFila">
                        <div class="formularioGrupo">
                            <label for="desnivelRuta">Desnivel (m) *</label>
                            <input type="number" id="desnivelRuta" name="desnivelRuta" placeholder="Ej: 300"
                                step="1" min="0" required value="<?php echo $form_values['desnivelRuta']; ?>">
                        </div>
                        <div class="formularioGrupo">
                            <label for="duracionHoras">Duración estimada</label>
                            <div class="formularioDuracion">
                                <input type="number" id="duracionHoras" name="duracionHoras" placeholder="Horas" min="0"
                                    max="24" value="<?php echo $form_values['duracionHoras']; ?>">
                                <span>h</span>
                                <input type="number" id="duracionMinutos" name="duracionMinutos" placeholder="Min"
                                    min="0" max="59" value="<?php echo $form_values['duracionMinutos']; ?>">
                                <span>min</span>
                            </div>
                        </div>
                    </div>

                    <div class="formularioGrupo">
                        <label for="ubicacionRuta">Ubicación (Nombre)</label>
                        <input type="text" id="ubicacionRuta" name="ubicacionRuta"
                            placeholder="Ej: Trassierra, Córdoba" required value="<?php echo $form_values['ubicacionRuta']; ?>">
                    </div>

                    <div class="formularioFila">
                        <div class="formularioGrupo">
                            <label for="latitudUbicacion">Latitud</label>
                            <input type="number" step="any" id="latitudUbicacion" name="latitudUbicacion" placeholder="Ej: 37.9351" value="<?php echo htmlspecialchars($latitud ?? ''); ?>">
                        </div>
                        <div class="formularioGrupo">
                            <label for="longitudUbicacion">Longitud</label>
                            <input type="number" step="any" id="longitudUbicacion" name="longitudUbicacion" placeholder="Ej: -4.8942" value="<?php echo htmlspecialchars($longitud ?? ''); ?>">
                        </div>
                    </div>

                    <div class="formularioGrupo">
                        <label for="descripcionRuta">Descripción de la ruta</label>
                        <textarea id="descripcionRuta" name="descripcionRuta" rows="5"
                            placeholder="Describe la ruta, el recorrido, puntos de interés..." required><?php echo $form_values['descripcionRuta']; ?></textarea>
                    </div>

                    <div class="formularioGrupo">
                        <label for="recomendacionesRuta">Recomendaciones de ropa y equipo</label>
                        <textarea id="recomendacionesRuta" name="recomendacionesRuta" rows="3"
                            placeholder="Calzado recomendado, ropa, equipo necesario..."><?php echo $form_values['recomendacionesRuta']; ?></textarea>
                    </div>

                    <div class="formularioGrupo">
                        <label>Imagen de la ruta (Máx. 1 imagen, 3MB)</label>
                        <div class="formularioImagenExaminar">
                            <input type="hidden" name="MAX_FILE_SIZE" value="3145728">
                            <div class="examinarFila">
                                <input type="file" id="imagenRuta" name="imagenRuta" accept="image/jpeg,image/png,image/gif,image/webp">
                                <button type="submit" name="accion" value="examinar" class="botonExaminar" formnovalidate>Examinar</button>
                            </div>
                            <p class="examinarInfo">Formatos: JPG, PNG, GIF, WEBP — Máx. 1 imagen de 3MB</p>

                            <?php if (!empty($imagenes_info)): ?>
                                <div class="imagenesResumen">
                                    <p class="imagenesContador">Imagen subida: <strong><?php echo count($imagenes_info); ?></strong> de 1</p>
                                    <table class="tablaImagenes">
                                        <thead>
                                            <tr>
                                                <th>Nº</th>
                                                <th>Nombre del archivo</th>
                                                <th>Tamaño</th>
                                                <th>Ruta</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php
                                            $tamano_total = 0;
                                            foreach ($imagenes_info as $idx => $img):
                                                $tamano_total += $img['tamano_bytes'];
                                            ?>
                                                <tr>
                                                    <td><?php echo $idx + 1; ?></td>
                                                    <td><?php echo htmlspecialchars($img['nombre']); ?></td>
                                                    <td><?php echo $img['tamano']; ?></td>
                                                    <td><?php echo htmlspecialchars($img['ruta']); ?></td>
                                                </tr>
                                            <?php endforeach; ?>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colspan="2"><strong>Total</strong></td>
                                                <td><strong><?php echo formatearTamano($tamano_total); ?></strong></td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            <?php endif; ?>
                        </div>
                    </div>

                    <div class="formularioBotones">
                        <a href="category_page.php" class="botonCancelar">Cancelar</a>
                        <button type="submit" name="accion" value="guardar" class="botonGuardar">Guardar Ruta <img src="Img/Icons/check.png"
                                alt="Guardar" class="iconoCheck"></button>
                    </div>
                </form>
            </div>
        </section>
    </main>

    <footer>
        <?php include 'Includes/footer.php'; ?>
    </footer>
</body>

</html>