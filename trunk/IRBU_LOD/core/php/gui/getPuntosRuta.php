<?php

require_once('../../../dll/php/conexionBD.php');

extract($_POST);
extract($_GET);
Header("content-type: application/x-javascript");

$salida = "{\"puntos\": [";
if ($id_ruta != "undefined" && $id_ruta != "") {
    $consultaSql = "SELECT ORDEN,LAT,LON FROM COORDENADAS_GPS WHERE ID_RUTA=$id_ruta ORDER BY ORDEN";
    consulta($consultaSql);
    $resulset = variasFilas();
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
}
$salida .="]}";
echo $salida;
?>