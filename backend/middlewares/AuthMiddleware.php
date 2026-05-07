<?php
require_once __DIR__ . '/../utils/Response.php';

class AuthMiddleware {
    
    // Verificar se o usuário está autenticado
    public static function check() {
        $headers = getallheaders();
        $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
        
        if (!$token) {
            Response::unauthorized("Token não fornecido");
            return false;
        }
        
        // Decodificar token (simples para teste - depois implementar JWT)
        $payload = json_decode(base64_decode($token), true);
        
        if (!$payload || !isset($payload['user_id'])) {
            Response::unauthorized("Token inválido");
            return false;
        }
        
        return $payload;
    }
    
    // Verificar se o usuário é admin
    public static function checkAdmin() {
        $payload = self::check();
        if (!$payload) return false;
        
        if (!isset($payload['tipo']) || $payload['tipo'] !== 'admin') {
            Response::unauthorized("Acesso restrito a administradores");
            return false;
        }
        
        return $payload;
    }
}
?>