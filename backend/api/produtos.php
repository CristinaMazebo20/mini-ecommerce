<?php
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conectar ao banco
$host = 'localhost';
$dbname = 'mazeboshop';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro no banco: ' . $e->getMessage()]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

// GET - Listar produtos
if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM produtos ORDER BY id DESC");
    $produtos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $produtos]);
    exit();
}

// POST - Criar produto
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    $nome = $data->nome ?? '';
    $descricao = $data->descricao ?? '';
    $preco = $data->preco ?? 0;
    $estoque = $data->estoque ?? 0;
    $imagem = $data->imagem ?? '';
    $categoria = $data->categoria ?? '';
    
    $stmt = $pdo->prepare("INSERT INTO produtos (nome, descricao, preco, estoque, imagem, categoria) 
                           VALUES (:nome, :descricao, :preco, :estoque, :imagem, :categoria)");
    $stmt->bindParam(":nome", $nome);
    $stmt->bindParam(":descricao", $descricao);
    $stmt->bindParam(":preco", $preco);
    $stmt->bindParam(":estoque", $estoque);
    $stmt->bindParam(":imagem", $imagem);
    $stmt->bindParam(":categoria", $categoria);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao criar']);
    }
    exit();
}

// PUT - Atualizar produto
if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    $stmt = $pdo->prepare("UPDATE produtos SET nome = :nome, descricao = :descricao, preco = :preco, 
                           estoque = :estoque, imagem = :imagem WHERE id = :id");
    $stmt->bindParam(":nome", $data->nome);
    $stmt->bindParam(":descricao", $data->descricao);
    $stmt->bindParam(":preco", $data->preco);
    $stmt->bindParam(":estoque", $data->estoque);
    $stmt->bindParam(":imagem", $data->imagem);
    $stmt->bindParam(":id", $data->id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
    exit();
}

// DELETE - Remover produto
if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    
    $stmt = $pdo->prepare("DELETE FROM produtos WHERE id = :id");
    $stmt->bindParam(":id", $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
    exit();
}

echo json_encode(['success' => false, 'message' => 'Método não permitido']);
?>