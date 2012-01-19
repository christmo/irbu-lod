<?php

require_once('../../../dll/php/conexionBD.php');

extract($_POST);
extract($_GET);
Header("content-type: application/x-javascript");

$salida = "{failure:true}";
if (isset($paradas) && count(json_decode($paradas)) > 0) {
    $consultaSql = "SELECT ID_PARADA,DIRECCION,DIR_IMG FROM PARADAS
                    WHERE ID_PARADA IN " . str_replace("[", "(", str_replace("]", ")", $paradas)) . " 
                    ORDER BY DIRECCION";
} else {
    $consultaSql = "SELECT ID_PARADA,DIRECCION,DIR_IMG FROM PARADAS ORDER BY DIRECCION";
}
consulta($consultaSql);
$resulset = variasFilas();

$salida = "{\"paradas\": [";
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
$salida .="]}";

echo $salida;
?>