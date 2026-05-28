<?php
// ══ Harrow School S.A.C. — Formulario de Contacto ══
// Desarrollado por Grupo 1 · SENATI Nuevo Chimbote

header("Content-Type: application/json; charset=UTF-8");

$correo_destino = "diegocortezibanez@gmail.com";
$correo_copia   = "admisiones@harrowschool.edu.pe";

$asunto_map = [
    "admision"  => "Admisión y Matrícula 2026",
    "becas"     => "Programa de Becas",
    "pensiones" => "Información sobre Pensiones",
    "academico" => "Consulta Académica",
    "sga"       => "Sistema SGA",
    "otro"      => "Otro"
];

function responder_error($mensaje) {
    echo json_encode(["status" => "error", "message" => $mensaje]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../contact.html");
    exit;
}

$nombre   = isset($_POST["nombre"])   ? trim($_POST["nombre"])   : "";
$apellido = isset($_POST["apellido"]) ? trim($_POST["apellido"]) : "";
$email    = isset($_POST["email"])    ? trim($_POST["email"])    : "";
$telefono_raw = isset($_POST["telefono"]) ? trim($_POST["telefono"]) : "";
$asunto   = isset($_POST["asunto"])   ? trim($_POST["asunto"])   : "";
$mensaje  = isset($_POST["mensaje"])  ? trim($_POST["mensaje"])  : "";

if ($nombre === "" || $apellido === "" || $email === "" || $asunto === "" || $mensaje === "") {
    responder_error("Por favor completa todos los campos obligatorios.");
}

if (!preg_match("/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü][A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]{1,49}$/u", $nombre)) {
    responder_error("El nombre solo puede contener letras (mínimo 2 caracteres).");
}

if (!preg_match("/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü][A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]{1,49}$/u", $apellido)) {
    responder_error("El apellido solo puede contener letras (mínimo 2 caracteres).");
}

$dominios_permitidos = ["gmail.com", "outlook.com", "hotmail.com", "senati.com.pe", "senati.pe"];

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 100) {
    responder_error("El correo electrónico no es válido.");
}

$partes_email = explode("@", strtolower($email));
if (count($partes_email) !== 2 || !in_array($partes_email[1], $dominios_permitidos, true)) {
    responder_error("Solo se aceptan @gmail.com, @outlook.com, @hotmail.com, @senati.com.pe o @senati.pe.");
}

if ($telefono_raw !== "") {
    $telefono_digitos = preg_replace("/\D/", "", $telefono_raw);
    if (!preg_match("/^9[0-9]{8}$/", $telefono_digitos)) {
        responder_error("El celular debe tener 9 dígitos y comenzar con 9.");
    }
    $telefono = htmlspecialchars($telefono_digitos);
} else {
    $telefono = "No proporcionado";
}

if (!isset($asunto_map[$asunto])) {
    responder_error("Selecciona un asunto válido.");
}

if (strlen($mensaje) < 10 || strlen($mensaje) > 1000) {
    responder_error("El mensaje debe tener entre 10 y 1000 caracteres.");
}

$nombre   = htmlspecialchars($nombre);
$apellido = htmlspecialchars($apellido);
$email    = htmlspecialchars($email);
$mensaje  = htmlspecialchars($mensaje);

$asunto_texto = $asunto_map[$asunto];

$subject = "Harrow School — Nuevo mensaje: $asunto_texto";

$body = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .header { background: #0B1F3A; padding: 20px 30px; }
            .header h2 { color: #C9A84C; margin: 0; font-size: 1.4rem; }
            .header p { color: rgba(255,255,255,0.7); margin: 5px 0 0; font-size: 0.85rem; }
            .content { padding: 30px; border: 1px solid #eee; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #0B1F3A; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
            .value { margin-top: 4px; color: #555; }
            .mensaje-box { background: #FAF8F3; border-left: 4px solid #C9A84C; padding: 15px; margin-top: 5px; border-radius: 4px; }
            .footer { background: #f5f5f5; padding: 15px 30px; font-size: 0.8rem; color: #999; text-align: center; }
        </style>
    </head>
    <body>
        <div class='header'>
            <h2>⚔ Harrow School S.A.C.</h2>
            <p>Nuevo mensaje desde el formulario de contacto</p>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Nombre completo</div>
                <div class='value'>$nombre $apellido</div>
            </div>
            <div class='field'>
                <div class='label'>Correo electrónico</div>
                <div class='value'><a href='mailto:$email'>$email</a></div>
            </div>
            <div class='field'>
                <div class='label'>Teléfono / Celular</div>
                <div class='value'>$telefono</div>
            </div>
            <div class='field'>
                <div class='label'>Asunto</div>
                <div class='value'>$asunto_texto</div>
            </div>
            <div class='field'>
                <div class='label'>Mensaje</div>
                <div class='mensaje-box'>$mensaje</div>
            </div>
        </div>
        <div class='footer'>
            Harrow School S.A.C. &mdash; Nuevo Chimbote, Áncash, Perú<br>
            Desarrollado por Grupo 1 &middot; SENATI Nuevo Chimbote &middot; 2026
        </div>
    </body>
    </html>
    ";

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Harrow School <no-reply@harrowschool.edu.pe>\r\n";
$headers .= "Reply-To: $email\r\n";

$enviado = mail($correo_destino, $subject, $body, $headers);

if ($enviado) {
    echo json_encode(["status" => "success", "message" => "¡Mensaje enviado correctamente! Nos comunicaremos contigo pronto."]);
} else {
    echo json_encode(["status" => "error", "message" => "Hubo un problema al enviar el mensaje. Inténtalo de nuevo."]);
}
?>