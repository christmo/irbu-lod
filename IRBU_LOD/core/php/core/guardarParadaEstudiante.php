<?php

session_start();
require_once('../../../dll/php/conexionBD.php');

extract($_POST);
$salida = "{failure:true}";

if ($idparada == 0) {
    $sql = "SELECT ID_PARADA FROM PARADAS WHERE LON=" . $lon . " AND LAT=" . $lat;
    consulta($sql);
    $r = unicaFila();
    $idparada = $r["ID_PARADA"];
}

$consultaSql = "INSERT INTO PARADA_ESTUDIANTE(CI_EST,ID_PARADA,FECHA_HORA,PERIODO)
                VALUES('" . $ci . "',$idparada,NOW(),'$periodo')";
consulta($consultaSql);
$salida = "{success:true,id:$idparada}";

echo $salida;
?>
