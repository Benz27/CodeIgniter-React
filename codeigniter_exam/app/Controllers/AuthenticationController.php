<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use App\Models\UserModel;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;
use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthenticationController extends BaseController
{

    static function create_jwt($user_id)
    {
        $key = env("encryption.jwt.secret");
        $payload = [
            'iat' => time(),
            'exp' => time() + 3600,
            'user_id' => $user_id
        ];
        return JWT::encode($payload, $key, "HS256");
    }

    static function decode_jwt($token)
    {
        $key = env("encryption.jwt.secret");
        return JWT::decode($token, new Key($key, 'HS256'));
    }

    public function register()
    {
        $validation = Services::validation();
        $validation->setRules([
            'username' => 'required|max_length[50]',
            'password'    => 'required|max_length[500]',
            'email'    => 'required|max_length[100]',
        ]);
        if (!$validation->withRequest($this->request)->run()) {
            return $this->response->setStatusCode(400)->setJSON($validation->getErrors());
        }
        $model = new UserModel();
        $body = $this->request->getJSON();
        $password = password_hash($body->password, PASSWORD_DEFAULT);
        $body->password = $password;
        $model->save($body);
        return $this->response->setJSON(['insertID' => $model->insertID]);
    }

    public function login()
    {
        $model = new UserModel();
        $body = $this->request->getJSON();
        $user = $model->findUser($body->username);
        if ($user && password_verify($body->password, $user['password'])) {
            $token = self::create_jwt($user['id']);
            unset($user["password"]);
            return $this->response->setJSON(['accessToken' => $token, 'user'=>$user]);
        } else {
            return $this->response->setStatusCode(401)->setJSON(['error' => 'Invalid credentials']);
        }
    }

    public function changePass(){
        $model = new UserModel();
        $body = $this->request->getJSON();
        $current = json_decode($this->request->getHeaderLine('User'));

        $user = $model->findUser($current->username);
        if ($user && password_verify($body->password, $user['password'])) {

            $model->update($user['id'], [
                'password' => password_hash($body->newpassword, PASSWORD_DEFAULT)
            ]);
            return $this->response->setJSON(['result'=>'ok']);
        } else {
            return $this->response->setStatusCode(401)->setJSON(['error' => 'Invalid credentials']);
        }
    }

    public function profile()
    {
        return $this->request->getHeaderLine('User');
    }

    public static function authenticate(string $accessToken){
        $token = null;
        if ($accessToken) {
            list($jwt) = sscanf($accessToken, 'Bearer %s');
            $token = $jwt;
        }
        if (!$token) {
            return ['error' => 'Token required'];
        }
        try {
            $decoded = self::decode_jwt($token);
            $model = new UserModel();
            $user = $model->asArray()->find($decoded->user_id);
            unset($user["password"]);
            return $user;
        } catch (\Exception $e) {
            return ['error' => 'Invalid token'];
        }
    }

    public function modify(){
        $user = json_decode($this->request->getHeaderLine('User'));
        $body = $this->request->getJSON();
        $model = new UserModel();
        $model->save([
            'id' => $user->id,
            "username" => $body->username ?? $user -> username,
            "email" => $body->email ?? $user->email,
        ]);
        return $this->response->setJSON(['id' => $user->id]);
    }
}
