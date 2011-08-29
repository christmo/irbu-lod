<?php

//$dir = "img/ori/";
$dir = "img/datap/";
//$dir_thumbs = "img/thumbs/";
$dir_thumbs = "img/datap/";

$images = array();
$d = dir($dir);
while ($name = $d->read()) {
    if (!preg_match('/\.(jpg|gif|png|JPG)$/', $name))
        continue;
    $size = filesize($dir . $name);
    $lastmod = filemtime($dir . $name) * 1000;
    //$thumb = "thumb_" . $name;
    $thumb =  $name;
    $images[] = array('name' => $name, 'size' => $size,
        'lastmod' => $lastmod, 'url' => $dir . $name,
        'thumb_url' => $dir_thumbs . $thumb);
}
$d->close();
$o = array('images' => $images);

echo json_encode($o);
