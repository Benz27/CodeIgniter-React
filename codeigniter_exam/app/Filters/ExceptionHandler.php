<?php


namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use Error;

class ExceptionHandler implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        set_error_handler([$this, "handleError"]);
        set_exception_handler([$this, 'handleException']);
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
    }

    
    public function handleException(\Throwable $exception): void
    {
        log_message('error', $exception->getMessage());
        http_response_code(500);
        echo json_encode([
            "code" => $exception->getCode(),
            "message" => $exception->getMessage(),
            "file" => $exception->getFile(),
            "line" => $exception->getLine()
        ]);
    }

    public function handleError(
        int $errno,
        string $errstr,
        string $errfile,
        int $errline
    ): bool {
        throw new \ErrorException($errstr, 0, $errno, $errfile, $errline);
    }
}