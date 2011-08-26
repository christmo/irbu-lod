<?php

session_start();
require_once('../../../dll/php/conexionBD.php');

extract($_POST);
//extract($_GET);

$json = json_decode($horas, true);

if (count($json) > 0) {
    for ($i = 0; $i < count($json); $i++) {
        $sql = "INSERT INTO RUTA_HORA(ID_RUTA,HORA) 
        VALUES($id_ruta,'". $json[$i]["hora"] . "')";
        consulta($sql);
    }
    $salida = "{success:true,id:$id_ruta}";
} else {
    $salida = "{failure:true}";
}

echo $salida;
?>