<?php
class Response {
    
    // Resposta padrão JSON
    public static function json($success, $data = null, $message = null, $code = 200) {
        http_response_code($code);
        echo json_encode([
            'success' => $success,
            'data' => $data,
            'message' => $message
        ]);
        exit();
    }
    
    // Resposta de sucesso
    public static function success($data = null, $message = "Operação realizada com sucesso") {
        self::json(true, $data, $message, 200);
    }
    
    // Resposta de erro
    public static function error($message = "Erro na operação", $code = 400) {
        self::json(false, null, $message, $code);
    }
    
    // Resposta não autorizada
    public static function unauthorized($message = "Acesso não autorizado") {
        self::json(false, null, $message, 401);
    }
    
    // Resposta não encontrado
    public static function notFound($message = "Recurso não encontrado") {
        self::json(false, null, $message, 404);
    }
    
    // Resposta de validação
    public static function validationError($errors) {
        self::json(false, $errors, "Erro de validação", 422);
    }
}
?>