<?php

/**
 * Este script permite hacer la gestión del contenido para el servidor
 * virtuosos.
 */
//session_start();
include 'constantes.php';
//require_once '../rest/Pest.php';
require_once 'Virtuoso.php';

//$rest = new Pest($url_servicio);
//$url = "point/dba/dba/-4.00135/-79.20124";

$data = array(
//  'user' => array(
    'username' => "error",
//    'password' => "pinocchio",
//    'display_name' => "Jiminy Cricket",
//    'kind' => "Student"
//  ) 
);
//echo json_encode($data);
//$post = $rest->post($url, $data);
//echo $post;
$demo = new Virtuoso();
//$point = $demo->crear_point('-4.00135', '-79.20124');
//echo $point;
//$parada = $demo->crear_poig($point, 'calle 1', 'calle 2', 'list esto ya se hizo vercha');
//echo $parada;
//$parada = $demo->crear_parada("demo de loja", "Frente a algo", "4.213", "-12.324", "http://demo.com/algo.jpg");
//echo $parada;
//$ruta = $demo->crear_ruta("nombre", "00:00", "RB");
//echo $ruta;
//$ci = $demo->crear_estudiante("1104058837");
//echo $ci;
//$prdfre=$demo->add_parada_estudiante("estd20120202024808", "pg20120202030514");
//echo $prdfre;
//$ord = $demo->orden_parada('10', 'prd20120202074105');
//echo $ord;
//$paraord = $demo->orden_parada_ruta("ord20120202074941", "ruta20120202021656");
//echo $paraord;
//echo $demo->get_rutas_horarios_parada("prd1");
//echo $demo->buscar_individuo_campo_igual($demo->ESTUDIANTE, "cedula", "1104058837","string/");
//echo $demo->buscar_individuo_campo_igual($demo->PARADA, "LocalizadaEn", "pg20120202030514");
//echo $demo->get_info_individuo("pg20120202030514");
//echo $demo->get_info_individuo("estd20120202024808");
//echo $demo->get_info_individuo("ruta20120202212658");

//$demo->add_hora_ruta("15:00", "ruta20120202212658")
//echo $demo->buscar_individuo_campo_igual($demo->ESTUDIANTE, "Prefiere", "pg20120202030514");
//echo $demo->buscar_individuo_campo_igual($demo->RUTA, "Prefiere", "pg20120202030514");

//lat -3.9961339833352
echo $demo->buscar_individuo_campo_igual($demo->PARADA, "lat", "-3.9961339833352");

?>
