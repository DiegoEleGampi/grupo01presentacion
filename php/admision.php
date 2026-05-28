<?php
// ══ Harrow School S.A.C. — Solicitud de Admisión ══
// Desarrollado por Grupo 1 · SENATI Nuevo Chimbote

header("Content-Type: application/json; charset=UTF-8");

$correo_destino = "diegocortezibanez@gmail.com";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../admision.html");
    exit;
}

$nombre_apoderado = isset($_POST["nombre_apoderado"]) ? htmlspecialchars(trim($_POST["nombre_apoderado"])) : "";
$apellido_apoderado = isset($_POST["apellido_apoderado"]) ? htmlspecialchars(trim($_POST["apellido_apoderado"])) : "";
$email = isset($_POST["email"]) ? htmlspecialchars(trim($_POST["email"])) : "";
$telefono = isset($_POST["telefono"]) ? htmlspecialchars(trim($_POST["telefono"])) : "";
$alumno_nombre = isset($_POST["alumno_nombre"]) ? htmlspecialchars(trim($_POST["alumno_nombre"])) : "";
$grado = isset($_POST["grado"]) ? htmlspecialchars(trim($_POST["grado"])) : "";
$tipo_ingreso = isset($_POST["tipo_ingreso"]) ? htmlspecialchars(trim($_POST["tipo_ingreso"])) : "";
$mensaje = isset($_POST["mensaje"]) ? htmlspecialchars(trim($_POST["mensaje"])) : "Sin comentarios adicionales";

if (
    empty($nombre_apoderado) || empty($apellido_apoderado) || empty($email) ||
    empty($telefono) || empty($alumno_nombre) || empty($grado) || empty($tipo_ingreso)
) {
    echo json_encode(["status" => "error", "message" => "Por favor completa todos los campos obligatorios."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => "error", "message" => "El correo electrónico no es válido."]);
    exit;
}

$grado_map = [
    "p1" => "Primaria — 1° grado",
    "p2" => "Primaria — 2° grado",
    "p3" => "Primaria — 3° grado",
    "p4" => "Primaria — 4° grado",
    "p5" => "Primaria — 5° grado",
    "p6" => "Primaria — 6° grado",
    "s1" => "Secundaria — 1° año",
    "s2" => "Secundaria — 2° año",
    "s3" => "Secundaria — 3° año",
    "s4" => "Secundaria — 4° año",
    "s5" => "Secundaria — 5° año",
];

$tipo_map = [
    "nuevo" => "Alumno nuevo",
    "traslado" => "Alumno por traslado",
];

$grado_texto = isset($grado_map[$grado]) ? $grado_map[$grado] : $grado;
$tipo_texto = isset($tipo_map[$tipo_ingreso]) ? $tipo_map[$tipo_ingreso] : $tipo_ingreso;

$subject = "Harrow School — Nueva solicitud de admisión 2026";

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
        <p>Nueva solicitud desde el formulario de admisión</p>
    </div>
    <div class='content'>
        <div class='field'>
            <div class='label'>Apoderado</div>
            <div class='value'>$nombre_apoderado $apellido_apoderado</div>
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
            <div class='label'>Nombre del postulante</div>
            <div class='value'>$alumno_nombre</div>
        </div>
        <div class='field'>
            <div class='label'>Grado solicitado</div>
            <div class='value'>$grado_texto</div>
        </div>
        <div class='field'>
            <div class='label'>Tipo de ingreso</div>
            <div class='value'>$tipo_texto</div>
        </div>
        <div class='field'>
            <div class='label'>Comentarios</div>
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
    echo json_encode([
        "status" => "success",
        "message" => "¡Solicitud enviada! Un asesor de admisiones se comunicará contigo pronto."
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Hubo un problema al enviar la solicitud. Inténtalo de nuevo o llámanos al +51 937 266 321."
    ]);
}
?>
