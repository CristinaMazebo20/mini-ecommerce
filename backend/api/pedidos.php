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

$method = $_SERVER['REQUEST_METHOD'];

// ==================== GET - Listar pedidos ====================
if ($method === 'GET') {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    $utilizador_id = isset($_GET['utilizador_id']) ? $_GET['utilizador_id'] : null;
    
    if ($id) {
        $query = "SELECT p.*, u.nome as cliente_nome FROM pedidos p 
                  LEFT JOIN utilizadores u ON p.utilizador_id = u.id 
                  WHERE p.id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        $pedido = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($pedido) {
            $itensQuery = "SELECT i.*, pr.nome as produto_nome 
                          FROM itens_pedido i 
                          LEFT JOIN produtos pr ON i.produto_id = pr.id 
                          WHERE i.pedido_id = :pedido_id";
            $itensStmt = $db->prepare($itensQuery);
            $itensStmt->bindParam(":pedido_id", $id);
            $itensStmt->execute();
            $pedido['itens'] = $itensStmt->fetchAll(PDO::FETCH_ASSOC);
            
            echo json_encode(['success' => true, 'data' => $pedido]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Pedido não encontrado']);
        }
    } else {
        $sql = "SELECT p.*, u.nome as cliente_nome FROM pedidos p 
                LEFT JOIN utilizadores u ON p.utilizador_id = u.id";
        
        if ($utilizador_id) {
            $sql .= " WHERE p.utilizador_id = :utilizador_id";
        }
        
        $sql .= " ORDER BY p.created_at DESC";
        
        $stmt = $db->prepare($sql);
        
        if ($utilizador_id) {
            $stmt->bindParam(":utilizador_id", $utilizador_id);
        }
        
        $stmt->execute();
        echo json_encode(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
    }
    exit();
}

// ==================== POST - Criar pedido ====================
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    $utilizador_id = $data->utilizador_id ?? 0;
    $endereco = $data->endereco ?? '';
    $cidade = $data->cidade ?? '';
    $cep = $data->cep ?? '';
    $forma_pagamento = $data->forma_pagamento ?? '';
    $total = $data->total ?? 0;
    $itens = $data->itens ?? [];
    
    $codigo = 'PED-' . date('Ymd') . '-' . rand(1000, 9999);
    
    $query = "INSERT INTO pedidos (utilizador_id, codigo, total, endereco, cidade, cep, forma_pagamento) 
              VALUES (:utilizador_id, :codigo, :total, :endereco, :cidade, :cep, :forma_pagamento)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":utilizador_id", $utilizador_id);
    $stmt->bindParam(":codigo", $codigo);
    $stmt->bindParam(":total", $total);
    $stmt->bindParam(":endereco", $endereco);
    $stmt->bindParam(":cidade", $cidade);
    $stmt->bindParam(":cep", $cep);
    $stmt->bindParam(":forma_pagamento", $forma_pagamento);
    
    if ($stmt->execute()) {
        $pedido_id = $db->lastInsertId();
        
        foreach ($itens as $item) {
            $itemQuery = "INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) 
                         VALUES (:pedido_id, :produto_id, :quantidade, :preco_unitario)";
            $itemStmt = $db->prepare($itemQuery);
            $itemStmt->bindParam(":pedido_id", $pedido_id);
            $itemStmt->bindParam(":produto_id", $item->produto_id);
            $itemStmt->bindParam(":quantidade", $item->quantidade);
            $itemStmt->bindParam(":preco_unitario", $item->preco_unitario);
            $itemStmt->execute();
        }
        
        echo json_encode(['success' => true, 'data' => ['id' => $pedido_id, 'codigo' => $codigo]]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao criar pedido']);
    }
    exit();
}

// ==================== PUT - Atualizar status ====================
if ($method === 'PUT') {
    $data = json_decode(file_get_contents("php://input"));
    
    $id = $data->id ?? 0;
    $status = $data->status ?? '';
    
    $query = "UPDATE pedidos SET status = :status WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":status", $status);
    $stmt->bindParam(":id", $id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Status atualizado']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao atualizar status']);
    }
    exit();
}

echo json_encode(['success' => false, 'message' => 'Método não permitido']);
?>