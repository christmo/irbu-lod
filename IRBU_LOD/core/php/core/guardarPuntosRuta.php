<?php

session_start();
require_once('../../../dll/php/conexionBD.php');

extract($_POST);

$json = json_decode($puntos, true);

if (count($json) > 0) {
    for ($i = 0; $i < count($json); $i++) {
        $sql = "INSERT INTO COORDENADAS_GPS(ID_RUTA,LON,LAT,ORDEN) 
        VALUES($id_ruta," . $json[$i]["longitud"] . "," . $json[$i]["latitud"] . "," . ($i + 1) . ")";
        consulta($sql);
    }
    $salida = "{success:true,id:$id_ruta}";
} else {
    $salida = "{failure:true}";
}

echo $salida;
?>
