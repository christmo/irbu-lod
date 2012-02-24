<?php

session_start();
require_once('../../../dll/php/conexionBD.php');
//require_once '../../../dll/php/Virtuoso.php';

extract($_POST);
//$rest = new Virtuoso();
$json = json_decode($paradas, true);

if (count($json) > 0) {
    $sql = "DELETE FROM RUTA_PARADA WHERE ID_RUTA=$id_ruta";
    consulta($sql);
    for ($i = 0; $i < count($json); $i++) {
        $sql = "INSERT INTO RUTA_PARADA
                VALUES($id_ruta," . $json[$i]["id"] . "," . $json[$i]["numero"] . ")";
        consulta($sql);
        
        //sacar id semantico de cada parada
//        $id_ordprd = $rest->orden_parada($json[$i]["numero"], $parada);
//        $rest->orden_parada_ruta($id_ordprd, $id_rlod);
        
    }
    $salida = "{success:true,id:$id_ruta}";
} else {
    $salida = "{failure:true}";
}

echo $salida;
?>