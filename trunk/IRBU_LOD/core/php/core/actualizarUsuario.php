<?php
session_start();
require_once('../../../dll/php/conexionBD.php');

extract($_POST);

$salida = "{failure:true}";

$consultaSql = "UPDATE USUARIOS 
                SET NOMBRE_USU = '$nombre',
                USUARIO_USU = '$usuario'";

if ($clave != "") {
    $consultaSql .= ",CLAVE_USU = '$clave'";
}

$consultaSql .= " WHERE ID_USU = '$id_usuario'";
consulta($consultaSql);

$salida = "{success:true}";

echo $salida;
?>
