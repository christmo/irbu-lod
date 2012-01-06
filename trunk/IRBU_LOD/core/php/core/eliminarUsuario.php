<?php

session_start();
require_once('../../../dll/php/conexionBD.php');

extract($_POST);

$salida = "{failure:true}";
if (is_numeric($id_usuario)) {
    $consultaSql = "DELETE FROM USUARIOS WHERE ID_USU=$id_usuario";
    consulta($consultaSql);
    
    $salida = "{success:true}";
}

echo $salida;
?>
