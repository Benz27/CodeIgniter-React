<?php
use \Firebase\JWT\JWT;

function create_jwt($user_id) {
    $key = getenv('JWT_SECRET');
    $payload = [
        'iat' => time(),
        'exp' => time() + 3600,
        'user_id' => $user_id 
    ];

    return JWT::encode($payload, $key, "HS256");
}

function decode_jwt($token) {
    $key = getenv('JWT_SECRET');
    return JWT::decode($token, $key);
}