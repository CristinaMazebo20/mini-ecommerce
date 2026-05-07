<?php
require_once "config/cors.php";

$request_uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

echo json_encode([
    'api' => 'MazeboShop API',
    'version' => '1.0.0',
    'endpoints' => [
        'auth' => '/api/auth.php',
        'produtos' => '/api/produtos.php',
        'pedidos' => '/api/pedidos.php',
        'utilizadores' => '/api/utilizadores.php'
    ],
    'status' => 'online'
]);
?>