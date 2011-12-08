<?php

session_start();
require_once('../../../dll/php/conexionBD.php');

extract($_POST);

if (is_numeric($id_ruta)) {
    if (!is_numeric($nombre_ruta)) {
        $consultaSql = "UPDATE RUTAS SET TIPO='$radTipoRecor',NOMBRE='$nombre_ruta' WHERE ID_RUTA=$id_ruta";
        consulta($consultaSql);
        $salida = "{success:true,id:$id_ruta}";
    } else {
        /**
         * Cuando en vez de escribir la nueva ruta se ha seleccionado una existente
         */
        $salida = "{failure:true,error:2}";
        if ($id_ruta == $nombre_ruta) {
            /**
             * Cuando solo se quiere editar la informacion de horas o los puntos de la
             * ruta
             */
            $salida = "{success:true,id:$id_ruta}";
        }
    }
} else {
    /**
     * Cuando no se ha seleccionado una ruta a editar y se ha escrito en el 
     * combo de seleccionar ruta
     */
    $salida = "{failure:true,error:1}";
}
echo $salida;
?>
