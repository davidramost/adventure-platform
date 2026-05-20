<?php
require_once 'vendor/autoload.php';
require_once 'mail-config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

$mail = new PHPMailer(true);

try {
    $mail->SMTPDebug = SMTP::DEBUG_CONNECTION;
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->AuthType   = 'LOGIN';
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->SMTPSecure = SMTP_ENCRYPTION;
    $mail->Port       = SMTP_PORT;
    $mail->CharSet    = 'UTF-8';
    $mail->Timeout    = 10;

    $mail->setFrom(MAIL_FROM, MAIL_FROM_NAME);
    $mail->addAddress('densetsuyami@gmail.com');
    $mail->Subject = 'Test PHPMailer Debug';
    $mail->Body    = 'Debug test';

    if ($mail->send()) {
        echo "✅ Email enviado\n";
    } else {
        echo "❌ Error: " . $mail->ErrorInfo . "\n";
    }
} catch (Exception $e) {
    echo "❌ Exception: " . $e->getMessage() . "\n";
}
