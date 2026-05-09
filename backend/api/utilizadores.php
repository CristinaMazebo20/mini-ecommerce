<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $pdo = new PDO("mysql:host=localhost;dbname=mazeboshop;charset=utf8", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro no banco: ' . $e->getMessage()]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

// GET - Listar utilizadores
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT id, nome, email, tipo, created_at FROM utilizadores ORDER BY id");
    echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    exit();
}

// PUT - Atualizar tipo
if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    $stmt = $pdo->prepare("UPDATE utilizadores SET tipo = :tipo WHERE id = :id");
    $stmt->bindParam(":tipo", $data->tipo);
    $stmt->bindParam(":id", $data->id);
    $stmt->execute();
    echo json_encode(['success' => true]);
    exit();
}

// DELETE - Remover utilizador
if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    $stmt = $pdo->prepare("DELETE FROM utilizadores WHERE id = :id AND tipo != 'admin'");
    $stmt->bindParam(":id", $id);
    $stmt->execute();
    echo json_encode(['success' => true]);
    exit();
}

echo json_encode(['success' => false, 'message' => 'Método não permitido']);
?>