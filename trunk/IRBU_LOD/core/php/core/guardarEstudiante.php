<?php

require_once('../../../dll/php/conexionBD.php');
//require_once '../../../dll/rest/Pest.php';
//require_once '../../../dll/php/Virtuoso.php';

extract($_POST);
$salida = "{failure:true}";
if (isset($ci)) {
    $consultaSql = "INSERT INTO ESTUDIANTES(CI_EST,NOMBRE_EST,MAIL_EST,USER_EST)
                VALUES('" . $ci . "','" . utf8_decode($nombre) . "','$mail','$user_est')";
    consulta($consultaSql);
    $salida = "{success:true}";

//    $rest = new Virtuoso();
//    $rest->crear_estudiante($ci);
}
echo $salida;
?>
