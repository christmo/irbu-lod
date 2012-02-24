<?php

require_once('../../../dll/php/conexionBD.php');

$salida = "{failure:true}";

$consultaSql = "SELECT DISTINCT PERIODO FROM parada_estudiante";

consulta($consultaSql);
$resulset = variasFilas();

$salida = "{\"periodos\": [";

for ($i = 0; $i < count($resulset); $i++) {
    if ($i == 0) {
        $salida .= "{
                \"id\":\"" . $i . "\",
                \"name\":\"Todos\"
            },";
    }
    $fila = $resulset[$i];
    $salida .= "{
                \"id\":\"" . ($i+1) . "\",
                \"name\":\"" . utf8_encode($fila["PERIODO"]) . "\"
        }";
    if ($i != count($resulset) - 1) {
        $salida .= ",";
    }
}

$salida .="]}";

echo $salida;
?>