<?php

session_start();
require_once('../../../dll/php/conexionBD.php');

extract($_POST);

if (is_numeric($id_parada)) {
    $consultaSql = "DELETE FROM RUTA_PARADA WHERE ID_PARADA=$id_parada";
    consulta($consultaSql);
    
    $consulta = "SELECT DIR_IMG FROM PARADAS WHERE ID_PARADA=$id_parada";
    consulta($consulta);
    $dato = unicaFila();
    $dir_img = $dato["DIR_IMG"];
    
    unlink('../../../'.$dir_img);
    
    $consultaSql = "DELETE FROM PARADAS WHERE ID_PARADA=$id_parada";
    consulta($consultaSql);

    $salida = "{success:true,id:$id_parada}";
} else {
    $salida = "{failure:true}";
}
echo $salida;
?>
