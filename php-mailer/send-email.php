<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

require_once __DIR__ . '/mail-config.php';
require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$apiKey = '';
if (function_exists('getallheaders')) {
    $headers = getallheaders();
    $apiKey = $headers['X-Api-Key'] ?? $headers['x-api-key'] ?? '';
}
if ($apiKey === '') {
    $apiKey = $_SERVER['HTTP_X_API_KEY'] ?? '';
}

if ($apiKey !== MAIL_API_KEY) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$raw = file_get_contents('php://input');
$input = json_decode($raw, true);

if (!is_array($input) || empty($input['to']) || empty($input['subject']) || empty($input['body'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields: to, subject, body']);
    exit;
}

$to = filter_var(trim($input['to']), FILTER_VALIDATE_EMAIL);
if ($to === false) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

$subject = htmlspecialchars(strip_tags(trim($input['subject'])), ENT_QUOTES, 'UTF-8');
$body = trim($input['body']);

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->AuthType   = 'LOGIN';
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->SMTPSecure = SMTP_ENCRYPTION;
    $mail->Port       = SMTP_PORT;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
    $mail->addReplyTo(MAIL_FROM, MAIL_FROM_NAME);
    $mail->addAddress($to);

    $mail->addCustomHeader('X-Priority', '3');
    $mail->addCustomHeader('X-Mailer', 'PHPMailer');
    $mail->addCustomHeader('List-Unsubscribe', '<mailto:unsubscribe@cicloflorenciopintado.es>');

    $mail->Subject = $subject;
    $mail->isHTML(true);
    $mail->Body    = $body;

    $mail->send();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Email could not be sent: ' . $mail->ErrorInfo]);
}
