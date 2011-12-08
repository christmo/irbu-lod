<?php

require_once('../../../dll/php/conexionBD.php');

//extract($_POST);
//extract($_GET);
Header("content-type: application/x-javascript");

$salida = "{failure:true}";

$consultaSql = "SELECT ID_PARADA,DIRECCION,DIR_IMG FROM PARADAS ORDER BY DIRECCION";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{\"paradas\": [";
//$salida = "stcCallback1001([";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            \"numero\":\"" . ($i + 1) . "\",
            \"id\":\"" . $fila["ID_PARADA"] . "\",
            \"direccion\":\"" . utf8_encode($fila["DIRECCION"]) . "\",
            \"url_img\":\"" . $fila["DIR_IMG"] . "\"
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

//$salida .="]);";
$salida .="]}";

echo $salida;
?>