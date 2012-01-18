<?php

require_once('../../../dll/php/conexionBD.php');

Header("content-type: application/x-javascript");

$salida = "{failure:true}";

$consultaSql = "SELECT ID_PARADA, DIRECCION, LAT, LON, REFERENCIA, DIR_IMG FROM PARADAS";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{failure:true}";
$orden = 1;
if (count($resulset) >= 1) {
    $datos = "";
    for ($i = 0; $i < count($resulset); $i++) {

        $fila = $resulset[$i];
        $datos .= $fila["ID_PARADA"] . "%"
                . $fila["LON"] . "%"
                . $fila["LAT"] . "%"
                . $fila["DIRECCION"] . "%"
                . $fila["REFERENCIA"] . "%"
                . $fila["DIR_IMG"] . "%"
                . $orden . "#";
        $orden = $orden + 1;
    }
    $salida = "{\"success\":true,\"datos\": { \"coordenadas\": '$datos' }}";
}
echo $salida;
?>