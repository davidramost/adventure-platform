<?php
session_start();
require_once 'Includes/db.php';

if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
    die("Acceso denegado. Solo administradores.");
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['id_ruta'])) {
    $id_ruta = filter_input(INPUT_POST, 'id_ruta', FILTER_VALIDATE_INT);

    if ($id_ruta) {
        try {
            $stmt = $pdo->prepare("SELECT imagen_url FROM ruta WHERE id_ruta = ?");
            $stmt->execute([$id_ruta]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($row) {
                $deleteStmt = $pdo->prepare("DELETE FROM ruta WHERE id_ruta = ?");
                $deleteStmt->execute([$id_ruta]);

                if ($deleteStmt->rowCount() > 0) {
                    $imagen_url = $row['imagen_url'];
                    if (!empty($imagen_url)) {
                        $ruta_fisica = __DIR__ . '/' . $imagen_url;

                        if (file_exists($ruta_fisica) && is_file($ruta_fisica)) {
                            unlink($ruta_fisica);
                        }
                    }
                    header("Location: category_page.php?msg=eliminado");
                    exit();
                } else {
                    echo "Error: No se pudo eliminar la ruta de la base de datos.";
                }
            } else {
                echo "Error: Ruta no encontrada.";
            }
        } catch (PDOException $e) {
            die("Error en la base de datos: " . $e->getMessage());
        }
    } else {
        echo "ID de ruta inválido.";
    }
} else {
    header("Location: category_page.php");
    exit();
}
