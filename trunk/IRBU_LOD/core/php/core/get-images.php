<?php

session_start();
require_once('../../../dll/php/conexionBD.php');
require_once('../../../dll/php/constantes.php');

$dir = "../../../".$src_img_paradas;

$images = array();
$d = dir($dir);
while ($name = $d->read()) {
    if (!preg_match('/\.(jpg|gif|png|JPG)$/', $name))
        continue;
    $size = filesize($dir . $name);
    $lastmod = filemtime($dir . $name) * 1000;
    $thumb = $name;

    $consulta = "SELECT DIRECCION,LAT,LON,REFERENCIA,ID_PARADA FROM PARADAS WHERE DIR_IMG='" . $src_img_paradas . $thumb . "'";
    consulta($consulta);
    $dato = unicaFila();
    $images[] = array(
        'name' => $name,
        'size' => $size,
        'lastmod' => $lastmod,
        'url' => $src_img_paradas . $name,
        'thumb_url' => $src_img_paradas . $thumb,
        'direccion' => utf8_encode($dato["DIRECCION"]),
        'lat' => $dato["LAT"],
        'lon' => $dato["LON"],
        'referencia' => utf8_encode($dato["REFERENCIA"]),
        'id' => $dato["ID_PARADA"]
    );
}
$d->close();
$o = array('images' => $images);

echo json_encode($o);
