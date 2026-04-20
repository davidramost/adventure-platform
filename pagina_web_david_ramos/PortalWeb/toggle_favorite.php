<?php
session_start();
require_once 'Includes/db.php';

header('Content-Type: application/json');

if (isset($_SESSION['id_usuario'])) {

    $id_usuario = $_SESSION['id_usuario'];

    if (isset($_POST['id_ruta'])) {
        $id_ruta = $_POST['id_ruta'];

        try {
            $sql_comprobar = "SELECT COUNT(*) FROM favorito WHERE id_ruta = ? AND id_usuario = ?";
            $stmt = $pdo->prepare($sql_comprobar);
            $stmt->execute([$id_ruta, $id_usuario]);

            $existe = $stmt->fetchColumn();

            if ($existe > 0) {
                $sql_borrar = "DELETE FROM favorito WHERE id_ruta = ? AND id_usuario = ?";
                $stmt_borrar = $pdo->prepare($sql_borrar);
                $stmt_borrar->execute([$id_ruta, $id_usuario]);

                echo json_encode(['status' => 'success', 'action' => 'removed']);
            } else {
                $sql_insertar = "INSERT INTO favorito (id_ruta, id_usuario) VALUES (?, ?)";
                $stmt_insertar = $pdo->prepare($sql_insertar);
                $stmt_insertar->execute([$id_ruta, $id_usuario]);

                echo json_encode(['status' => 'success', 'action' => 'added']);
            }
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Error BD']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Falta ID ruta']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Debes iniciar sesión']);
}
