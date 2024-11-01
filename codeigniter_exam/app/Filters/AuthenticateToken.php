<?php
namespace App\Filters;

use App\Controllers\AuthenticationController;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\IncomingRequest;
use Exception;

class AuthenticateToken implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    { 
        
        if (! $request instanceof IncomingRequest) {
            return;
        }

        if ($request->is('OPTIONS')) {
            return;
        }

        $result = AuthenticationController::authenticate($request->getHeaderLine("Authorization"));
        if(array_key_exists("error", $result)){
            throw new Exception($result["error"]);
        }
        $request->setHeader("User", json_encode($result));
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
    }
}