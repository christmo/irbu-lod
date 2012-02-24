<?php

require_once('../../../../dll/php/conexionBD.php');
extract($_GET);

$salida = "{failure:true}";
if (isset($periodo)) {
    if ($periodo == 'Todos') {
        $consultaSql = "SELECT CI_EST, DIR_EST, LAT_CASA, LON_CASA FROM viviendas
                        WHERE FECHA_HORA in (
                        SELECT MAX(FECHA_HORA)
                        FROM viviendas
                        GROUP BY CI_EST)";
    } else {
        $consultaSql = "SELECT CI_EST, DIR_EST, LAT_CASA, LON_CASA FROM viviendas
                        WHERE FECHA_HORA in (
                        SELECT MAX(FECHA_HORA)
                        FROM viviendas
                        WHERE PERIODO='$periodo'
                        GROUP BY CI_EST)";
    }

    consulta($consultaSql);
    $resulset = variasFilas();

    $salida = "{\"casas\": [";

    for ($i = 0; $i < count($resulset); $i++) {
        $fila = $resulset[$i];
        $salida .= "{
            \"numero\":\"" . ($i+1) . "\",
            \"ci\":\"" . $fila["CI_EST"] . "\",
            \"dir\":\"" . $fila["DIR_EST"] . "\",
            \"lat\":\"" . $fila["LAT_CASA"] . "\",
            \"lon\":\"" . $fila["LON_CASA"] . "\"
        }";
        if ($i != count($resulset) - 1) {
            $salida .= ",";
        }
    }

    $salida .="]}";
}
echo $salida;
?>