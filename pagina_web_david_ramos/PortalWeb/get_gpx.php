<?php
$base_path = __DIR__ . '/Includes/rutas_gpx/';

$ruta_param = isset($_GET['ruta']) ? $_GET['ruta'] : '';
$ruta_clean = preg_replace('/[^a-zA-Z0-9_-]/', '', $ruta_param);

if (empty($ruta_clean)) {
    $ruta_clean = 'bejarano';
}

$file = $base_path . $ruta_clean . '.gpx';

if (file_exists($file)) {
    header('Content-Type: application/xml');
    header('Content-Length: ' . filesize($file));
    header('Access-Control-Allow-Origin: *');
    readfile($file);
} else {
    http_response_code(404);
    echo "Error: Archivo GPX no encontrado: " . $ruta_clean . ".gpx";
}
