<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'AppController::index');
$routes->get('/app/(.*)', 'AppController::index');
$routes->get('/app', 'AppController::index');

$routes->options('api/(.*)', static function () {
    $response = response();
    $response->setStatusCode(204);
    $response->setHeader('Allow:', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    return $response;
});
$routes->group('api', function ($routes) {
    $routes->group('authentication', function ($routes) {
        $routes->post('register', 'AuthenticationController::register');
        $routes->post('login', 'AuthenticationController::login');
        $routes->get('profile', 'AuthenticationController::profile');
        $routes->put('profile', 'AuthenticationController::modify');
        $routes->put('profile/changepass', 'AuthenticationController::changePass');

    });
    $routes->group('blog', function ($routes) {

        $routes->get('', 'BlogPostController::all');
        $routes->get('(:num)', 'BlogPostController::get/$1');

        $routes->post('', 'BlogPostController::save');

        $routes->put('(:num)', 'BlogPostController::modify/$1');

        $routes->delete('(:num)', 'BlogPostController::delete/$1');
    });
});
