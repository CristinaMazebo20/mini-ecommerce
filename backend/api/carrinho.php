<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: http://localhost:4200");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $db = new PDO("mysql:host=localhost;dbname=mazeboshop;charset=utf8", "root", "");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro no banco: ' . $e->getMessage()]);
    exit();
}

// Obter token do usuário via header
$headers = getallheaders();
$token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
$utilizador_id = 1; // Temporário - depois implementar JWT

$method = $_SERVER['REQUEST_METHOD'];

// GET - Buscar carrinho do usuário
if ($method === 'GET') {
    $query = "SELECT c.*, p.nome, p.preco, p.imagem 
              FROM carrinho c 
              JOIN produtos p ON c.produto_id = p.id 
              WHERE c.utilizador_id = :utilizador_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":utilizador_id", $utilizador_id);
    $stmt->execute();
    
    echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    exit();
}

// POST - Adicionar/Atualizar item no carrinho
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    $produto_id = $data->produto_id ?? 0;
    $quantidade = $data->quantidade ?? 1;
    
    // Verificar se já existe
    $checkQuery = "SELECT id, quantidade FROM carrinho WHERE utilizador_id = :user_id AND produto_id = :produto_id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(":user_id", $utilizador_id);
    $checkStmt->bindParam(":produto_id", $produto_id);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() > 0) {
        $item = $checkStmt->fetch(PDO::FETCH_ASSOC);
        $novaQuantidade = $item['quantidade'] + $quantidade;
        $updateQuery = "UPDATE carrinho SET quantidade = :quantidade WHERE id = :id";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->bindParam(":quantidade", $novaQuantidade);
        $updateStmt->bindParam(":id", $item['id']);
        $updateStmt->execute();
    } else {
        $insertQuery = "INSERT INTO carrinho (utilizador_id, produto_id, quantidade) VALUES (:user_id, :produto_id, :quantidade)";
        $insertStmt = $db->prepare($insertQuery);
        $insertStmt->bindParam(":user_id", $utilizador_id);
        $insertStmt->bindParam(":produto_id", $produto_id);
        $insertStmt->bindParam(":quantidade", $quantidade);
        $insertStmt->execute();
    }
    
    echo json_encode(['success' => true, 'message' => 'Item adicionado ao carrinho']);
    exit();
}

// DELETE - Remover item do carrinho
if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    
    $query = "DELETE FROM carrinho WHERE id = :id AND utilizador_id = :user_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $id);
    $stmt->bindParam(":user_id", $utilizador_id);
    $stmt->execute();
    
    echo json_encode(['success' => true, 'message' => 'Item removido']);
    exit();
}

// PUT - Atualizar quantidade
if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id ?? 0;
    $quantidade = $data->quantidade ?? 0;
    
    $query = "UPDATE carrinho SET quantidade = :quantidade WHERE id = :id AND utilizador_id = :user_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":quantidade", $quantidade);
    $stmt->bindParam(":id", $id);
    $stmt->bindParam(":user_id", $utilizador_id);
    $stmt->execute();
    
    echo json_encode(['success' => true, 'message' => 'Quantidade atualizada']);
    exit();
}
?>