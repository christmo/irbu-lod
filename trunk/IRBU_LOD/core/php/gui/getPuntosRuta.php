<?php

require_once('../../../dll/php/conexionBD.php');

extract($_POST);
extract($_GET);
Header("content-type: application/x-javascript");

$salida = "{failure:true}";

$consultaSql = "SELECT ORDEN,LAT,LON FROM COORDENADAS_GPS WHERE ID_RUTA=$id_ruta ORDER BY ORDEN";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{\"puntos\": [";
//$salida = "stcCallback1001([";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            \"numero\":\"" . $fila["ORDEN"] . "\",
            \"latitud\":\"" . $fila["LAT"] . "\",
            \"longitud\":\"" . $fila["LON"] . "\"
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

//$salida .="]);";
$salida .="]}";

echo $salida;
?>