<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Content-Type: application/json");

// Dados mockados para teste
$produtos = [
    ['id' => 1, 'nome' => 'iPhone 15 Pro', 'preco' => 1250000, 'estoque' => 10],
    ['id' => 2, 'nome' => 'Samsung Galaxy S24', 'preco' => 980000, 'estoque' => 8]
];

echo json_encode(['success' => true, 'data' => $produtos]);
?>