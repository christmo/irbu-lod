<?php

session_start();
require_once('../../../dll/php/conexionBD.php');

extract($_POST);
$salida = "{failure:true}";

$consultaSql = "INSERT INTO VIVIENDAS(CI_EST,DIR_EST,LAT_CASA,LON_CASA,FECHA_HORA,PERIODO)
                VALUES('" . $ci . "','" . utf8_decode($dir) . "',$lat,$lon,NOW(),'$periodo')";
consulta($consultaSql);
$salida = "{success:true}";

echo $salida;
?>
