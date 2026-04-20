<?php

$host = "localhost";
$dbname = "rutas_app";
$usuario = "admin_db";
$password = "gKMhSvvq5llz&15&";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $usuario, $password);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
