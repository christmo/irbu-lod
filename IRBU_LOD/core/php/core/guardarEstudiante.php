<?php

session_start();
require_once('../../../dll/php/conexionBD.php');

extract($_POST);
$salida = "{failure:true}";

$consultaSql = "INSERT INTO ESTUDIANTES(CI_EST,NOMBRE_EST,MAIL_EST,USER_EST)
                VALUES('" . $ci . "','" . utf8_decode($nombre) . "','$mail','$user_est')";
consulta($consultaSql);
$salida = "{success:true}";

echo $salida;
?>
