<?php
/**
 * SIMAS - Built-in Web Server Router for PHP
 * Usage: php -S localhost:3000 router.php
 */

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// 1. Root redirect to login
if ($uri === '/' || $uri === '') {
    header('Location: /pages/login.html');
    exit;
}

// 2. REST API Requests
if (str_starts_with($uri, '/api/')) {
    require __DIR__ . '/backend-php/routes.php';
    exit;
}

// 3. Fallback for root-level html (e.g. /aset.html -> /pages/aset.html)
if (preg_match('#^/([a-zA-Z0-9_\-]+)\.html$#', $uri, $matches)) {
    $target = __DIR__ . '/pages/' . $matches[1] . '.html';
    if (file_exists($target)) {
        header('Location: /pages/' . $matches[1] . '.html');
        exit;
    }
}

// 4. Static file serving (CSS, JS, Images, Pages)
$filePath = __DIR__ . $uri;
if (file_exists($filePath) && !is_dir($filePath)) {
    return false; // Let PHP's built-in webserver serve the file directly
}

// 5. 404 Not Found
http_response_code(404);
echo "404 Not Found: " . htmlspecialchars($uri);

