<?php

session_start();
require_once('../../../dll/php/conexionBD.php');

extract($_POST);
$salida = "{failure:true}";

$consultaSql = "INSERT INTO PARADA_ESTUDIANTE(CI_EST,ID_PARADA,FECHA_HORA,PERIODO)
                VALUES('" . $ci . "',$id_parada,NOW(),'$periodo')";
consulta($consultaSql);
$salida = "{success:true}";

echo $salida;
?>
