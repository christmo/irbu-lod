<?php

session_start();
require_once('../../../dll/php/conexionBD.php');

extract($_GET);

if (is_numeric($id_ruta)) {
    $consultaSql = "delete FROM ruta_parada where id_ruta=$id_ruta";
    consulta($consultaSql);
    $consultaSql = "delete FROM coordenadas_gps where id_ruta=$id_ruta";
    consulta($consultaSql);
    $consultaSql = "delete FROM ruta_hora where id_ruta=$id_ruta";
    consulta($consultaSql);
    $consultaSql = "delete FROM rutas where id_ruta=$id_ruta";
    consulta($consultaSql);
    $salida = "{success:true,id:$id_ruta}";
} else {
    $salida = "{failure:true}";
}
echo $salida;
?>
