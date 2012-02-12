<?php
session_start();
require_once('../../../dll/php/conexionBD.php');
require_once('../../../dll/php/constantes.php');
require_once '../../../dll/php/Virtuoso.php';

extract($_POST);

$allowedType = array(
    'image/jpeg', 'image/pjpeg', 'image/png', 'image/gif', 'image/x-png'
);

$sql = "SELECT MAX(ID_PARADA)+1 AS ID_PARADA FROM PARADAS";
consulta($sql);
$dato = unicaFila();
$id_parada = $dato["ID_PARADA"];

$uploaded = 0;
$failed = 0;

foreach ($_FILES['img']['name'] as $key => $img) {
    if (in_array($_FILES['img']['type'][$key], $allowedType)) {
        // max upload file is 500 KB
        if ($_FILES['img']['size'][$key] <= 500000) {
            // upload file
            $img_nom = $id_parada . substr($_FILES['img']['name'][$key], -4);
            move_uploaded_file($_FILES['img']['tmp_name'][$key], $dir_img .DIRECTORY_SEPARATOR. $img_nom);
            $uploaded++;
        } else {
            $failed++;
        }
    } else if ($_FILES['img']['type'][$key] != '') {
        $failed++;
    }
}

$dir_img = $src_img_paradas . $img_nom;

$consultaSql = "INSERT INTO PARADAS(ID_PARADA,DIRECCION,LAT,LON,REFERENCIA,DIR_IMG)
VALUES($id_parada,'".utf8_decode($dir)."',$lat,$lon,'".utf8_decode($ref)."','$dir_img')";
consulta($consultaSql);

echo '{success: true, failed: ' . $failed . ', parada: ' .$id_parada. ', uploaded: ' . $uploaded . ', type: "' . $_FILES['img']['name'][0] . '"}';

$rest=new Virtuoso();
$rest->crear_parada($dir, $ref, $lon, $lat, $dir_img);
?>