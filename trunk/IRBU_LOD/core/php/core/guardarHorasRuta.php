<?php

session_start();
require_once('../../../dll/php/conexionBD.php');
require_once '../../../dll/php/Virtuoso.php';

extract($_POST);
//extract($_GET);
$rest = new Virtuoso();
$json = json_decode($horas, true);

if (count($json) > 0) {
    for ($i = 0; $i < count($json); $i++) {
        $sql = "INSERT INTO RUTA_HORA(ID_RUTA,HORA) 
        VALUES($id_ruta,'" . $json[$i]["hora"] . "')";
        consulta($sql);
        $rest->add_hora_ruta($json[$i]["hora"], $id_rlod);
    }
    $salida = "{success:true,id:$id_ruta}";
} else {
    $salida = "{failure:true}";
}

echo $salida;
?>