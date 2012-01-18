<?php

session_start();
require_once('../../../dll/php/conexionBD.php');
extract($_POST);

/**
 * Buscar las paradas cercanas a 100 metros al punto seleccionado
 */
$meters = 100;

$factorLAT = $meters / (1852 * 60);
$factorLON = (($meters * 0.00001) / 0.000111 ) / 10000;

$lat1 = $lat - $factorLAT;
$lat2 = $lat + $factorLAT;
$lon1 = $lon - $factorLON;
$lon2 = $lon + $factorLON;

$consultaSql = " SELECT ID_PARADA, DIRECCION, LAT, LON, REFERENCIA, DIR_IMG FROM
PARADAS WHERE ( LON >= $lon1 AND LON <= $lon2 ) AND ( LAT >= $lat1 AND LAT <= $lat2)";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{failure:true}";
$orden = 1;
if (count($resulset) >= 1) {
    $datos = "";
    for ($i = 0; $i < count($resulset); $i++) {
        $fila = $resulset[$i];
        $datos .= $fila["ID_PARADA"];
        if ($i != count($resulset) - 1) {
            $datos .= ",";
        }
    }
    $salida = "{\"success\":\"true\",\"datos\": { \"paradas\": '$datos' }}";
}
echo $salida;
?>
