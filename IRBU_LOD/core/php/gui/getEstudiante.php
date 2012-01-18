<?php

require_once('../../../dll/php/conexionBD.php');

extract($_POST);
extract($_GET);
Header("content-type: application/x-javascript");

$salida = "{failure:true}";

//$consultaSql = "SELECT CI_EST,NOMBRE_EST,MAIL_EST FROM ESTUDIANTES WHERE USER_EST='$user_est'";
$consultaSql = "SELECT E.CI_EST,E.NOMBRE_EST,E.MAIL_EST, (SELECT DIR_EST
FROM VIVIENDAS
WHERE FECHA_HORA = (SELECT MAX(FECHA_HORA) FROM VIVIENDAS WHERE CI_EST=E.CI_EST)) AS DIR_EST
FROM ESTUDIANTES E
WHERE E.USER_EST='$user_est'";

consulta($consultaSql);
$resulset = unicaFila();

if (count($resulset) > 0) {
    $salida = "{\"estudiante\": ";
    $fila = $resulset;
    $salida .= "{
            \"ci\":\"" . $fila["CI_EST"] . "\",
            \"nombre\":\"" . utf8_encode($fila["NOMBRE_EST"]) . "\",
            \"mail\":\"" . utf8_encode($fila["MAIL_EST"]) . "\",
            \"direccion\":\"" . utf8_encode($fila["DIR_EST"]) . "\"
        }";
    $salida .="}";
}

echo $salida;
?>