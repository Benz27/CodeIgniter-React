<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\ResponseInterface;

class AppController extends BaseController
{
    public function index()
    {
        return view('react/static_build.php');

    }
}
