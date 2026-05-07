<?php
// Ativar exibição de erros
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Headers
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Teste simples para ver se o arquivo está sendo chamado
// Descomente a linha abaixo para testar
// echo json_encode(["teste" => "API auth.php está funcionando"]); exit();

// Conectar ao banco
try {
    $db = new PDO("mysql:host=localhost;dbname=mazeboshop;charset=utf8", "root", "");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro no banco: ' . $e->getMessage()]);
    exit();
}

// Receber dados
$input = file_get_contents("php://input");
$data = json_decode($input);

// Se não recebeu dados, retornar erro
if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Dados não recebidos. Input: ' . $input]);
    exit();
}

$action = $data->action ?? '';

if (empty($action)) {
    echo json_encode(['success' => false, 'message' => 'Ação não especificada']);
    exit();
}

// ==================== LOGIN ====================
if ($action === 'login') {
    $email = $data->email ?? '';
    $senha = $data->senha ?? '';
    
    $query = "SELECT id, nome, email, tipo FROM utilizadores WHERE email = :email AND senha = :senha";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":senha", $senha);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $usuario, 'message' => 'Login realizado']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Email ou senha inválidos']);
    }
    exit();
}

// ==================== REGISTO ====================
if ($action === 'registar') {
    $nome = $data->nome ?? '';
    $email = $data->email ?? '';
    $senha = $data->senha ?? '';
    
    if (empty($nome) || empty($email) || empty($senha)) {
        echo json_encode(['success' => false, 'message' => 'Todos os campos são obrigatórios']);
        exit();
    }
    
    // Verificar email duplicado
    $checkQuery = "SELECT id FROM utilizadores WHERE email = :email";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(":email", $email);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Email já cadastrado']);
        exit();
    }
    
    $query = "INSERT INTO utilizadores (nome, email, senha, tipo) VALUES (:nome, :email, :senha, 'cliente')";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":nome", $nome);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":senha", $senha);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Conta criada com sucesso!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao criar conta']);
    }
    exit();
}

// ==================== RECUPERAR SENHA ====================
if ($action === 'recuperar') {
    $email = $data->email ?? '';
    $token = bin2hex(random_bytes(32));
    echo json_encode(['success' => true, 'data' => ['token' => $token], 'message' => 'Token gerado']);
    exit();
}

// ==================== REDEFINIR SENHA ====================
if ($action === 'redefinir') {
    echo json_encode(['success' => true, 'message' => 'Senha redefinida']);
    exit();
}

// Se chegou aqui, ação não reconhecida
echo json_encode(['success' => false, 'message' => 'Ação não reconhecida: ' . $action]);
?>