<?php

include ('../../../../dll/php/conexionBD.php');
extract($_POST);

$consultaSql = "SELECT USUARIO_USU,CLAVE_USU 
        FROM USUARIOS 
        WHERE USUARIO_USU = '" . $txtUsuario . "'
        AND CLAVE_USU = '" . encriptar($txtClave) . "'";

consulta($consultaSql);
$registro = unicaFila();

if ($registro["CLAVE_USU"] == encriptar($txtClave) && $registro["USUARIO_USU"] == $txtUsuario) {
    session_start();
    $_SESSION["usuario"] = $registro["USUARIO_USU"];
    $_SESSION["sesion"] = true;
    echo '{"success": true, "login":{"web": "user"}}';
} else {
    echo '{"success": false, "errors":{"reason": "Usuario o contraseña incorrecta"}}';
}
?>
