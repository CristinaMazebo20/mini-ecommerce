<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: http://localhost:4200");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, PUT, DELETE, OPTIONS");
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

$method = $_SERVER['REQUEST_METHOD'];

// GET - Listar utilizadores
if ($method === 'GET') {
    $query = "SELECT id, nome, email, tipo, created_at FROM utilizadores ORDER BY id";
    $stmt = $db->prepare($query);
    $stmt->execute();
    echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    exit();
}

// PUT - Atualizar tipo do utilizador
if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    $id = $data->id ?? 0;
    $tipo = $data->tipo ?? '';
    
    $query = "UPDATE utilizadores SET tipo = :tipo WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":tipo", $tipo);
    $stmt->bindParam(":id", $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Utilizador atualizado']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao atualizar']);
    }
    exit();
}

// DELETE - Remover utilizador
if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    
    $query = "DELETE FROM utilizadores WHERE id = :id AND tipo != 'admin'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $id);
    
    if ($stmt->execute() && $stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Utilizador removido']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Não é possível remover admin ou usuário não encontrado']);
    }
    exit();
}

echo json_encode(['success' => false, 'message' => 'Método não permitido']);
?>