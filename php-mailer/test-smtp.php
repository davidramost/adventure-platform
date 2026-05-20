<?php
$host = '185.23.118.147';
$port = 587;
$user = 'noreply@cicloflorenciopintado.es';
$pass = '394Jb0u#p';

echo "Intentando conectar a $host:$port...\n";

$connection = @fsockopen($host, $port, $errno, $errstr, 5);

if ($connection) {
    echo "✅ Conexión exitosa\n";
    fclose($connection);
} else {
    echo "❌ Error: $errstr ($errno)\n";
}
