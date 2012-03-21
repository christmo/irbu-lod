<?php

session_start();
require_once('../../../dll/php/conexionBD.php');

extract($_POST);
$salida = "{failure:true}";

$consultaSql = "INSERT INTO USUARIOS(NOMBRE_USU,USUARIO_USU,CLAVE_USU)
                VALUES('" . utf8_decode($nombre) . "','" . utf8_decode($usuario) . "','".encriptar($clave)."')";
consulta($consultaSql);
$salida = "{success:true}";

echo $salida;
?>
