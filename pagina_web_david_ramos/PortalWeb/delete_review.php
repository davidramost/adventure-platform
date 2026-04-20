<?php
session_start();
require_once 'Includes/db.php';

if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'admin') {
    header("Location: login.php");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $id_resena = isset($_POST['id_resena']) ? (int)$_POST['id_resena'] : 0;
    $id_ruta = isset($_POST['id_ruta']) ? (int)$_POST['id_ruta'] : 0;

    if ($id_resena > 0) {
        try {
            $stmt = $pdo->prepare("DELETE FROM resena WHERE id_resena = ?");
            if ($stmt->execute([$id_resena])) {
                header("Location: content_page.php?id=" . $id_ruta . "&msg=resena_eliminada");
                exit();
            } else {
                 header("Location: content_page.php?id=" . $id_ruta . "&err=error_eliminar");
                exit();
            }
        } catch (PDOException $e) {
             header("Location: content_page.php?id=" . $id_ruta . "&err=" . urlencode("Error al eliminar reseña"));
            exit();
        }
    }
}

if ($id_ruta > 0) {
    header("Location: content_page.php?id=" . $id_ruta);
} else {
    header("Location: category_page.php");
}
exit();
?>
