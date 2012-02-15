<?php

session_start();
require_once('../../../dll/php/conexionBD.php');
require_once '../../../dll/php/Virtuoso.php';

//extract($_POST);
extract($_GET);

if (is_numeric($nombreRuta)) {
    $salida = "{failure:true}";
} else {
    $consulta = "SELECT MAX(ID_RUTA)+1 AS ID_RUTA FROM RUTAS";
    consulta($consulta);
    $dato = unicaFila();
    $id_ruta = $dato["ID_RUTA"];

    $consultaSql = "INSERT INTO RUTAS(ID_RUTA,TIPO,NOMBRE) 
                    VALUES($id_ruta,'$radioTipo','" . utf8_decode($nombreRuta) . "')";
    consulta($consultaSql);
//    $rest = new Virtuoso();
//    $id_rlod = $rest->crear_ruta($nombreRuta, "00:00", $radioTipo);
    $id_rlod = 0;
    $salida = "{success:true,id:$id_ruta,id_rlod:$id_rlods}";
}
echo $salida;
?>
