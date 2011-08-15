<?php

//Comprobar si la sesión ya fue iniciada
if (!isset($_SESSION)) {
    session_start();
}

$rutaPrincipal = "index.php";

//Comprobar si esta logeado
if ( !isset($_SESSION["usuario"]) || !isset($_SESSION["sesion"])) {    
    alerta($rutaPrincipal);
}

function alerta($rut) {
    //REDIRECCIONAR
      echo '<script type="text/javascript">';
      echo "window.location='$rut';";
      echo '</script>';
}
?>
