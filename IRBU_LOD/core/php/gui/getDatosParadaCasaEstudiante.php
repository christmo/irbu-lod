<?php
require_once('../../../dll/php/conexionBD.php');
extract($_POST);

//$ci = '1104058837';

$consultaSql = "SELECT P.ID_PARADA,P.DIRECCION,P.REFERENCIA,P.LAT,P.LON,P.DIR_IMG
                FROM PARADA_ESTUDIANTE PE, PARADAS P
                WHERE P.ID_PARADA=PE.ID_PARADA AND PE.CI_EST = '$ci'";

consulta($consultaSql);
$resulset = unicaFila();

$salida = "{failure:true";
if (count($resulset) > 0) {
    $salida = "{\"parada\": ";
    $fila = $resulset;
    $salida .= "{
            \"id_parada\":\"" . $fila["ID_PARADA"] . "\",
            \"dir\":\"" . utf8_encode($fila["DIRECCION"]) . "\",
            \"ref\":\"" . utf8_encode($fila["REFERENCIA"]) . "\",
            \"lat\":\"" . $fila["LAT"] . "\",
            \"lon\":\"" . $fila["LON"] . "\",
            \"img\":\"" . $fila["DIR_IMG"] . "\"
        }";
}
$consultaSql = "SELECT C.DIR_EST,C.LAT_CASA,C.LON_CASA
                FROM VIVIENDAS C
                WHERE CI_EST = '$ci' 
                AND FECHA_HORA =(
                    SELECT MAX(FECHA_HORA)
                    FROM VIVIENDAS
                    WHERE CI_EST='$ci'
               )";

consulta($consultaSql);
$resulset = unicaFila();

if (count($resulset) > 0) {
    $salida .= ",";
    $salida .= "\"casa\": ";
    $salida .= "{
            \"dir\":\"" . utf8_encode($resulset["DIR_EST"]) . "\",
            \"lat\":\"" . $resulset["LAT_CASA"] . "\",
            \"lon\":\"" . $resulset["LON_CASA"] . "\"
        }";
}
$salida .="}";
echo $salida;
?>
