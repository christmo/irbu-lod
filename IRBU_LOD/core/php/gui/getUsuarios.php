<?php

require_once('../../../dll/php/conexionBD.php');

extract($_POST);
Header("content-type: application/x-javascript");

$salida = "{failure:true}";

$consultaSql = "SELECT ID_USU,NOMBRE_USU,USUARIO_USU FROM USUARIOS WHERE USUARIO_USU<>'christmo' ORDER BY NOMBRE_USU";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{\"nombres\": [";

for ($i = 0; $i < count($resulset); $i++) {
    $fila = $resulset[$i];
    $salida .= "{
            \"id\":\"" . $fila["ID_USU"] . "\",
            \"nombre\":\"" . utf8_encode($fila["NOMBRE_USU"]) . "\",
            \"usuario\":\"" . utf8_encode($fila["USUARIO_USU"]) . "\"
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>