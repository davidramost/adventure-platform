<?php
header('Content-Type: application/json');

$latitud = isset($_GET['lat']) ? floatval($_GET['lat']) : null;
$longitud = isset($_GET['lon']) ? floatval($_GET['lon']) : null;

if (!$latitud || !$longitud) {
    echo json_encode(['error' => 'Coordenadas inválidas']);
    exit();
}

$api_key = "cd68960265d272422570f363eaccffd1";
$url = "https://api.openweathermap.org/data/2.5/weather?lat=" . $latitud . "&lon=" . $longitud . "&appid=" . $api_key . "&units=metric&lang=es";

$response = @file_get_contents($url);
if ($response !== false) {
    echo $response;
} else {
    echo json_encode(['error' => 'No se pudo obtener los datos del tiempo']);
}
