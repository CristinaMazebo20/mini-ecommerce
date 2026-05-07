<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: http://localhost:4200");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

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

$data = json_decode(file_get_contents("php://input"));
$action = $data->action ?? '';

// SOLICITAR RECUPERAÇÃO
if ($action === 'solicitar') {
    $email = $data->email ?? '';
    
    $query = "SELECT id FROM utilizadores WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $email);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
        $token = bin2hex(random_bytes(32));
        $expira = date('Y-m-d H:i:s', strtotime('+1 hour'));
        
        $insertQuery = "INSERT INTO recuperacao_senha (utilizador_id, token, expira_em) VALUES (:user_id, :token, :expira)";
        $insertStmt = $db->prepare($insertQuery);
        $insertStmt->bindParam(":user_id", $usuario['id']);
        $insertStmt->bindParam(":token", $token);
        $insertStmt->bindParam(":expira", $expira);
        $insertStmt->execute();
        
        echo json_encode(['success' => true, 'data' => ['token' => $token], 'message' => 'Token gerado']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Email não encontrado']);
    }
    exit();
}

// VERIFICAR TOKEN
if ($action === 'verificar') {
    $token = $data->token ?? '';
    
    $query = "SELECT * FROM recuperacao_senha WHERE token = :token AND usado = 0 AND expira_em > NOW()";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":token", $token);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Token válido']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Token inválido ou expirado']);
    }
    exit();
}

// REDEFINIR SENHA
if ($action === 'redefinir') {
    $token = $data->token ?? '';
    $novaSenha = $data->novaSenha ?? '';
    
    $query = "SELECT utilizador_id FROM recuperacao_senha WHERE token = :token AND usado = 0 AND expira_em > NOW()";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":token", $token);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $recuperacao = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $updateQuery = "UPDATE utilizadores SET senha = :senha WHERE id = :user_id";
        $updateStmt = $db->prepare($updateQuery);
        $updateStmt->bindParam(":senha", $novaSenha);
        $updateStmt->bindParam(":user_id", $recuperacao['utilizador_id']);
        $updateStmt->execute();
        
        $updateToken = "UPDATE recuperacao_senha SET usado = 1 WHERE token = :token";
        $updateTokenStmt = $db->prepare($updateToken);
        $updateTokenStmt->bindParam(":token", $token);
        $updateTokenStmt->execute();
        
        echo json_encode(['success' => true, 'message' => 'Senha redefinida com sucesso']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Token inválido ou expirado']);
    }
    exit();
}

echo json_encode(['success' => false, 'message' => 'Ação não reconhecida']);
?>