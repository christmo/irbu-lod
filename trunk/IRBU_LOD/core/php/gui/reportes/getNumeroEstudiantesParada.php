<?php

require_once('../../../../dll/php/conexionBD.php');
extract($_GET);
Header("content-type: application/x-javascript");

$salida = "{failure:true}";
if (isset($periodo)) {
    if ($periodo == 'Todos') {
        $consultaSql = "SELECT p.direccion as parada, count(*) as estudiantes, dir_img
                FROM paradas p, parada_estudiante pe
                WHERE P.ID_PARADA = PE.ID_PARADA
                GROUP BY p.id_parada";
    } else {
        $consultaSql = "SELECT p.direccion as parada, count(*) as estudiantes, dir_img
                FROM paradas p, parada_estudiante pe
                WHERE P.ID_PARADA = PE.ID_PARADA
                AND PE.PERIODO = '$periodo'
                GROUP BY p.id_parada";
    }

    consulta($consultaSql);
    $resulset = variasFilas();

    $salida = "{\"reporte\": [";

    for ($i = 0; $i < count($resulset); $i++) {
        $fila = $resulset[$i];
        $salida .= "{
            \"numero\":\"" . ($i + 1) . "\",
            \"parada\":\"" . $fila["parada"] . "\",
            \"estudiantes\":\"" . $fila["estudiantes"] . "\",
            \"img\":\"" . $fila["dir_img"] . "\"
        }";
        if ($i != count($resulset) - 1) {
            $salida .= ",";
        }
    }

    $salida .="]}";
}
echo $salida;
?>