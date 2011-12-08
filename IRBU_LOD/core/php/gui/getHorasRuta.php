<?php

require_once('../../../dll/php/conexionBD.php');

//extract($_POST);
extract($_GET);
Header("content-type: application/x-javascript");

$salida = "{failure:true}";

$consultaSql = "SELECT ID_RUTA,HORA FROM RUTA_HORA WHERE ID_RUTA=$id_ruta";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{\"horas\": [";
//$salida = "stcCallback1001([";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            \"numero\":\"" . ($i+1) . "\",
            \"hora\":\"" . $fila["HORA"] . "\"
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

//$salida .="]);";
$salida .="]}";

echo $salida;
?>