<?php

session_start();
require_once('../../../dll/php/conexionBD.php');
require_once('../../../dll/php/constantes.php');
extract($_POST);

//$ori_dir = 'img/ori/';
//$thumb_dir = 'img/thumbs/';

$allowedType = array(
    'image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/x-png'
);

$uploaded = 0;
$failed = 0;

foreach ($_FILES['img']['name'] as $key => $img) {
    if (in_array($_FILES['img']['type'][$key], $allowedType)) {
        // max upload file is 500 KB
        if ($_FILES['img']['size'][$key] <= 500000) {
            $img_nom = $id_parada . substr($_FILES['img']['name'][$key], -4);
            /**
             * Eliminar la Parada existente
             */
            unlink('../../../' . $src_img_paradas . $img_nom);
            /**
             * Copiar la nueva parada a la carpeta de imagenes desde el cliente
             */
            move_uploaded_file($_FILES['img']['tmp_name'][$key], $dir_img . $img_nom);

            $uploaded++;
        } else {
            $failed++;
        }
    } else if ($_FILES['img']['type'][$key] != '') {
        $failed++;
    }
}

$consultaSql = "UPDATE PARADAS 
                SET DIRECCION = '$dir_vep'
                ,REFERENCIA = '$ref_vep'";
if ($uploaded == 1) {
    $dir_img = $src_img_paradas . $img_nom;
    $consultaSql .=",DIR_IMG = '$dir_img'";
}
if ($latParada_vep != '0.0') {
    $consultaSql .= ",LAT = $latParada_vep";
}
if ($lonParada_vep != '0.0') {
    $consultaSql .= ",LON = $lonParada_vep";
}
$consultaSql .= " WHERE ID_PARADA = $id_parada";
consulta($consultaSql);

$salida = "{success:true,id:$id_parada}";

echo $salida;
?>