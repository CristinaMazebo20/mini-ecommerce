<?php
class Validator {
    
    // Validar email
    public static function email($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }
    
    // Validar se campo está vazio
    public static function required($value, $fieldName) {
        if (empty(trim($value))) {
            return "$fieldName é obrigatório";
        }
        return null;
    }
    
    // Validar tamanho mínimo
    public static function minLength($value, $min, $fieldName) {
        if (strlen($value) < $min) {
            return "$fieldName deve ter no mínimo $min caracteres";
        }
        return null;
    }
    
    // Validar se senhas coincidem
    public static function passwordMatch($password, $confirmPassword) {
        if ($password !== $confirmPassword) {
            return "As senhas não coincidem";
        }
        return null;
    }
}
?>