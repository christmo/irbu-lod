<?php

/**
 * Este script permite hacer la gestión del contenido para el servidor
 * virtuosos.
 */
session_start();
include 'constantes.php';
require_once '../rest/Pest.php';

$rest = new Pest($url_servicio);
try {
    $get = $rest->get('parada/');
    $json = json_decode($get, true);
    $vars = $json["head"]["vars"];
    for ($i = 0; $i < count($json["results"]["bindings"]); $i++) {
        echo $json["results"]["bindings"][$i][$vars[4]]["value"] . '<br/>';
    }
} catch (Exception $e) {
    echo 'No se puede realizar la consulta...';
}

?>
