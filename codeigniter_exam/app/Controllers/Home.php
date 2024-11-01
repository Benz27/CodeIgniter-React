<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index(): string
    {
        return view('welcome_message');
    }

    public function sayhello()
    {
        $json = $this->request->getJSON();

        // Now you can access the properties of the JSON object
        $password = $json->password ?? null; // Use null coalescing to avoid undefined property error


        return $this->response->setJSON(['message' => "registration success".$password]);
    }
}
