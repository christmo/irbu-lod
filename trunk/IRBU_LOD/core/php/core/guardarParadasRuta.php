<?php

session_start();
require_once('../../../dll/php/conexionBD.php');

extract($_POST);

$json = json_decode($paradas, true);

if (count($json) > 0) {
    for ($i = 0; $i < count($json); $i++) {
        $sql = "INSERT INTO RUTA_PARADA
                VALUES($id_ruta,". $json[$i]["id"] . ",". $json[$i]["numero"] . ")";
        consulta($sql);
    }
    $salida = "{success:true,id:$id_ruta}";
} else {
    $salida = "{failure:true}";
}

echo $salida;
?>