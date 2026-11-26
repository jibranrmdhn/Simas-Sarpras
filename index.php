<?php
/**
 * SIMAS - Apache / XAMPP Entry Point
 */

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Check if request is directed to an API endpoint
if (strpos($uri, '/api/') !== false) {
    require __DIR__ . '/backend-php/routes.php';
    exit;
}

// Redirect root access to login page
header('Location: pages/login.html');
exit;

